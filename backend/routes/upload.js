import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import { dbGet, dbRun, dbAll } from '../database/db.js';
import { authMiddleware } from '../middleware/auth.js';
import { indexDocument, deindexDocument } from '../services/vector.js';

const router = express.Router();

// Multer — explicit in-memory storage (keeps file in req.file.buffer, no disk I/O)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB cap
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF documents are accepted.'), false);
    }
  }
});

// Helper to fetch current user's chatbot ID
async function getUserChatbotId(userId) {
  const business = await dbGet('SELECT id FROM businesses WHERE user_id = ?', [userId]);
  if (!business) return null;
  const chatbot = await dbGet('SELECT id FROM chatbots WHERE business_id = ?', [business.id]);
  return chatbot ? chatbot.id : null;
}

// 1. UPLOAD MANUALLY ENTERED FAQ
router.post('/upload-faq', authMiddleware, async (req, res) => {
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ error: 'Question and answer are required.' });
  }

  try {
    const chatbotId = await getUserChatbotId(req.user.id);
    if (!chatbotId) {
      return res.status(404).json({ error: 'Chatbot account not found.' });
    }

    const docId = 'faq_' + Math.random().toString(36).substring(2, 15);
    const content = `Question: ${question.trim()}\nAnswer: ${answer.trim()}`;
    const filename = `faq_${docId}.txt`;

    // Save to Database
    await dbRun(
      'INSERT INTO documents (id, chatbot_id, filename, content, type) VALUES (?, ?, ?, ?, ?)',
      [docId, chatbotId, filename, content, 'faq']
    );

    // Sync Vector Store Cache
    await indexDocument(chatbotId, docId, content);

    res.status(201).json({
      message: 'FAQ successfully indexed in Knowledge Base.',
      document: { id: docId, filename, type: 'faq', created_at: new Date() }
    });
  } catch (error) {
    console.error('FAQ upload error:', error);
    res.status(500).json({ error: 'Failed to process and index FAQ.' });
  }
});

// 2. UPLOAD & PARSE PDF FILE
router.post('/upload-pdf', authMiddleware, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Please upload a PDF document.' });
  }

  try {
    const chatbotId = await getUserChatbotId(req.user.id);
    if (!chatbotId) {
      return res.status(404).json({ error: 'Chatbot account not found.' });
    }

    // Extract text from raw file buffer
    const data = await pdfParse(req.file.buffer);
    const extractedText = data.text;

    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(400).json({ error: 'PDF content is empty or contains insufficient extractable text.' });
    }

    const docId = 'pdf_' + Math.random().toString(36).substring(2, 15);
    const filename = req.file.originalname;

    // Save to Database
    await dbRun(
      'INSERT INTO documents (id, chatbot_id, filename, content, type) VALUES (?, ?, ?, ?, ?)',
      [docId, chatbotId, filename, extractedText, 'pdf']
    );

    // Sync Vector Store Cache
    await indexDocument(chatbotId, docId, extractedText);

    res.status(201).json({
      message: 'PDF document successfully parsed and loaded into chatbot knowledge base.',
      document: { id: docId, filename, type: 'pdf', created_at: new Date() }
    });
  } catch (error) {
    console.error('PDF processing error:', error);
    res.status(500).json({ error: 'Failed to parse and index PDF document.' });
  }
});

// 3. GET ALL DOCUMENTS IN THE KNOWLEDGE BASE
router.get('/documents', authMiddleware, async (req, res) => {
  try {
    const chatbotId = await getUserChatbotId(req.user.id);
    if (!chatbotId) {
      return res.status(404).json({ error: 'Chatbot account not found.' });
    }

    const documents = await dbAll(
      'SELECT id, filename, type, created_at, LENGTH(content) as char_count FROM documents WHERE chatbot_id = ? ORDER BY created_at DESC',
      [chatbotId]
    );

    res.json(documents);
  } catch (error) {
    console.error('Fetch documents error:', error);
    res.status(500).json({ error: 'Failed to retrieve knowledge base documents.' });
  }
});

// 4. DELETE A DOCUMENT FROM KNOWLEDGE BASE
router.delete('/documents/:id', authMiddleware, async (req, res) => {
  const docId = req.params.id;

  try {
    const chatbotId = await getUserChatbotId(req.user.id);
    if (!chatbotId) {
      return res.status(404).json({ error: 'Chatbot account not found.' });
    }

    // Verify ownership
    const doc = await dbGet('SELECT * FROM documents WHERE id = ? AND chatbot_id = ?', [docId, chatbotId]);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found or unauthorized.' });
    }

    // Delete from Database
    await dbRun('DELETE FROM documents WHERE id = ?', [docId]);

    // Deindex from memory vector cache
    deindexDocument(chatbotId, docId);

    res.json({ message: 'Document successfully deleted from chatbot knowledge base.' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Failed to delete knowledge base document.' });
  }
});

export default router;
