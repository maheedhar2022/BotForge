import { OpenAI } from 'openai';
import { dbAll } from '../database/db.js';

// Setup OpenAI client conditionally
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.trim() === '') return null;
  return new OpenAI({ apiKey });
};

// Global in-memory index to store chunks with their vector representation
// { chatbotId: [ { docId, content, vector } ] }
const vectorCache = {};

// Helper to compute dot product
function dotProduct(vecA, vecB) {
  let product = 0;
  for (let i = 0; i < vecA.length; i++) {
    product += vecA[i] * vecB[i];
  }
  return product;
}

// Helper to compute magnitude of a vector
function magnitude(vec) {
  let sum = 0;
  for (let i = 0; i < vec.length; i++) {
    sum += vec[i] * vec[i];
  }
  return Math.sqrt(sum);
}

// Helper to compute Cosine Similarity between two vectors
export function cosineSimilarity(vecA, vecB) {
  const dProd = dotProduct(vecA, vecB);
  const magA = magnitude(vecA);
  const magB = magnitude(vecB);
  if (magA === 0 || magB === 0) return 0;
  return dProd / (magA * magB);
}

// A smart, zero-dependency, local keyword/token vector generator
// This creates a dense vector based on term frequency mapping to a vocabulary of unique terms.
// Extremely fast, requires no API key, and offers high semantic utility for localized search.
function generateLocalEmbedding(text, vocabulary = null) {
  // Normalize and split words
  const cleanTokens = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(t => t.length > 2); // filter tiny words

  if (!vocabulary) {
    // Generate dictionary for this specific document/query
    const uniqueTokens = [...new Set(cleanTokens)];
    const vector = uniqueTokens.map(token => {
      // count frequency
      return cleanTokens.filter(t => t === token).length;
    });
    return { vector, vocabulary: uniqueTokens };
  }

  // Map tokens against an existing vocabulary
  const vector = vocabulary.map(token => {
    return cleanTokens.filter(t => t === token).length;
  });
  return vector;
}

// Main embedding function
export async function getEmbedding(text, vocabulary = null) {
  const openai = getOpenAIClient();
  if (openai) {
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text.replace(/\n/g, ' '),
      });
      return response.data[0].embedding;
    } catch (err) {
      console.warn('OpenAI embedding generation failed, falling back to local indexing:', err.message);
    }
  }

  // Local fallback
  return generateLocalEmbedding(text, vocabulary);
}

// Text Chunking Utility
export function chunkText(text, maxChars = 600, overlap = 150) {
  if (!text) return [];
  const chunks = [];
  let index = 0;

  // Split into lines or paragraphs to preserve context boundaries where possible
  const sections = text.split('\n').filter(s => s.trim().length > 0);
  let currentChunk = '';

  for (const sec of sections) {
    if ((currentChunk + '\n' + sec).length > maxChars) {
      if (currentChunk.trim().length > 0) {
        chunks.push(currentChunk.trim());
      }
      // Overlap by sliding or keeping the last part
      currentChunk = currentChunk.substring(Math.max(0, currentChunk.length - overlap)) + '\n' + sec;
    } else {
      currentChunk = currentChunk ? currentChunk + '\n' + sec : sec;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

// Initialize and build index from database on start
export async function initializeVectorCache() {
  console.log('Building semantic vector indices for RAG pipeline...');
  try {
    const docs = await dbAll('SELECT * FROM documents');
    for (const doc of docs) {
      await indexDocument(doc.chatbot_id, doc.id, doc.content);
    }
    console.log(`Successfully cached vectors for ${docs.length} documents.`);
  } catch (error) {
    console.error('Error loading documents for vector cache:', error);
  }
}

// Index a specific document chunked contents
export async function indexDocument(chatbotId, docId, content) {
  if (!vectorCache[chatbotId]) {
    vectorCache[chatbotId] = [];
  }

  // Remove existing entries for this document to avoid duplicates
  vectorCache[chatbotId] = vectorCache[chatbotId].filter(item => item.docId !== docId);

  const chunks = chunkText(content);
  const hasOpenAI = getOpenAIClient() !== null;

  if (hasOpenAI) {
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const vector = await getEmbedding(chunk);
      vectorCache[chatbotId].push({
        docId,
        content: chunk,
        vector
      });
    }
  } else {
    // If local matching, compile all chunks to form a single local vocabulary
    const masterVocab = [...new Set(
      content.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(t => t.length > 2)
    )];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const vector = generateLocalEmbedding(chunk, masterVocab);
      vectorCache[chatbotId].push({
        docId,
        content: chunk,
        vocab: masterVocab,
        vector
      });
    }
  }
}

// Remove document from memory cache
export function deindexDocument(chatbotId, docId) {
  if (vectorCache[chatbotId]) {
    vectorCache[chatbotId] = vectorCache[chatbotId].filter(item => item.docId !== docId);
  }
}

// Retrieve relevant context chunks based on query
export async function retrieveContext(chatbotId, query, limit = 3) {
  const cache = vectorCache[chatbotId] || [];
  if (cache.length === 0) return '';

  const hasOpenAI = getOpenAIClient() !== null;

  if (hasOpenAI) {
    const queryVector = await getEmbedding(query);
    const scoredChunks = cache.map(chunk => {
      const similarity = cosineSimilarity(queryVector, chunk.vector);
      return { content: chunk.content, score: similarity };
    });

    // Sort descending by score
    scoredChunks.sort((a, b) => b.score - a.score);
    return scoredChunks.slice(0, limit).map(c => c.content).join('\n\n');
  } else {
    // Local Match Fallback: calculate word overlap/token intersection scores
    const cleanQueryTokens = query.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(t => t.length > 2);

    const scoredChunks = cache.map(chunk => {
      // If we saved pre-calculated local vectors, compute similarity or simply check intersection
      let score = 0;
      if (chunk.vocab && chunk.vector) {
        const queryVector = generateLocalEmbedding(query, chunk.vocab);
        score = cosineSimilarity(queryVector, chunk.vector);
      } else {
        // Fallback simple token overlap
        const cleanChunkTokens = chunk.content.toLowerCase()
          .replace(/[^\w\s]/g, '')
          .split(/\s+/)
          .filter(t => t.length > 2);
        
        const intersection = cleanQueryTokens.filter(t => cleanChunkTokens.includes(t));
        score = intersection.length / Math.max(1, cleanQueryTokens.length);
      }
      return { content: chunk.content, score };
    });

    scoredChunks.sort((a, b) => b.score - a.score);
    // Filter out items with absolutely zero match if we have at least one partial match
    const validMatches = scoredChunks.filter(c => c.score > 0);
    const finalSelection = validMatches.length > 0 ? validMatches : scoredChunks;

    return finalSelection.slice(0, limit).map(c => c.content).join('\n\n');
  }
}
