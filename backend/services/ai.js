import { OpenAI } from 'openai';
import { retrieveContext } from './vector.js';

// Setup OpenAI client conditionally
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.trim() === '') return null;
  return new OpenAI({ apiKey });
};

// Generates response from OpenAI or Local Fallback Engine
export async function generateChatbotResponse({
  chatbotId,
  botName,
  welcomeMessage,
  promptOverride,
  userMessage,
  conversationHistory = []
}) {
  // 1. Retrieve semantic context from vector store
  const context = await retrieveContext(chatbotId, userMessage);

  const defaultSystemPrompt = `You are a helpful and polite AI customer support assistant named "${botName}".
You represent this business. Answer visitor questions professionally, concisely, and friendly.

Here is the verified business knowledge base context:
---
${context || 'No specific document content uploaded yet.'}
---

INSTRUCTIONS:
1. ONLY answer queries using the provided business knowledge base context above.
2. If the answer cannot be found in the context, or if the context is empty, politely inform the user that you don't have that information on hand, but offer to take down their contact details so a team member can follow up with them.
3. Always maintain a helpful, welcoming tone and keep your answers under 3-4 sentences unless explaining a list.
4. NEVER invent or hallucinate facts (pricing, timings, services) not explicitly stated in the context.`;

  const finalSystemPrompt = promptOverride ? `${defaultSystemPrompt}\n\nAdditional Guidance: ${promptOverride}` : defaultSystemPrompt;

  const openai = getOpenAIClient();

  if (openai) {
    try {
      // Format history for OpenAI
      const apiMessages = [
        { role: 'system', content: finalSystemPrompt },
        ...conversationHistory.slice(-6).map(msg => ({
          role: msg.sender === 'bot' ? 'assistant' : 'user',
          content: msg.message
        })),
        { role: 'user', content: userMessage }
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: apiMessages,
        temperature: 0.3,
        max_tokens: 250
      });

      return completion.choices[0].message.content;
    } catch (err) {
      console.warn('OpenAI completion failed. Falling back to local NLP engine:', err.message);
    }
  }

  // LOCAL INTENT MATCHING ENGINE (Fallback)
  return compileLocalNLPResponse(userMessage, context, botName, welcomeMessage);
}

// Local mock NLP pipeline that returns excellent context-based responses without API keys
function compileLocalNLPResponse(message, context, botName, welcomeMessage) {
  const cleanMsg = message.toLowerCase().trim();

  // Basic greeting
  if (/^(hello|hi|hey|greetings|good morning|good afternoon|howdy)/i.test(cleanMsg)) {
    return `Hello! I am ${botName}, your automated customer assistant. ${welcomeMessage}\n\nHow can I help you today?`;
  }

  // Thank you intents
  if (/thanks|thank you|awesome|great|perfect/i.test(cleanMsg)) {
    return "You're very welcome! Let me know if you need help with anything else.";
  }

  // Lead collection prompt triggers
  if (/book|appointment|contact|call|email|hire|pricing|cost|price|membership|buy|order/i.test(cleanMsg) && (!context || context.length === 0)) {
    return `I would love to help you with that! However, I don't have our active booking schedule or specific files configured at this moment. Let me collect your name and email/phone, and our team will contact you directly to assist! Just use the contact card below.`;
  }

  // Context parser
  if (context && context.trim().length > 0) {
    // Attempt semantic keyword scoring across chunks
    // Split context by double newline to read separate chunks/FAQs
    const chunks = context.split('\n\n');
    let bestChunk = null;
    let maxMatch = 0;

    const words = cleanMsg.replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 3);

    for (const chunk of chunks) {
      let matches = 0;
      for (const word of words) {
        if (chunk.toLowerCase().includes(word)) {
          matches++;
        }
      }
      if (matches > maxMatch) {
        maxMatch = matches;
        bestChunk = chunk;
      }
    }

    if (bestChunk && maxMatch > 0) {
      // Try to isolate the "Answer" if it's formatted as "Question: / Answer:"
      const answerRegex = /Answer:\s*([\s\S]+)/i;
      const match = bestChunk.match(answerRegex);
      if (match && match[1]) {
        return match[1].trim();
      }
      return bestChunk.trim();
    }
  }

  // General fallback response
  return `Thank you for your question! I want to make sure I give you the most accurate answer. Since my owner hasn't uploaded specific documentation for that yet, could you share your contact details? I'll have a human specialist reach out to you within 24 hours!`;
}
