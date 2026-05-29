import express from 'express';
import { dbGet, dbRun, dbAll } from '../database/db.js';
import { authMiddleware } from '../middleware/auth.js';
import { generateChatbotResponse } from '../services/ai.js';

const router = express.Router();

// 1. PUBLIC VISITOR CHAT ENDPOINT (Accessed by Widget)
router.post('/chat', async (req, res) => {
  const { chatbotId, visitorId, message } = req.body;

  if (!chatbotId || !visitorId || !message) {
    return res.status(400).json({ error: 'Missing required parameters: chatbotId, visitorId, message' });
  }

  try {
    // Verify chatbot exists
    const chatbot = await dbGet('SELECT * FROM chatbots WHERE id = ?', [chatbotId]);
    if (!chatbot) {
      return res.status(404).json({ error: 'Chatbot not found.' });
    }

    // Find or create conversation
    let conversation = await dbGet(
      'SELECT * FROM conversations WHERE chatbot_id = ? AND visitor_id = ?',
      [chatbotId, visitorId]
    );

    let conversationId;
    if (!conversation) {
      conversationId = 'conv_' + Math.random().toString(36).substring(2, 15);
      await dbRun(
        'INSERT INTO conversations (id, chatbot_id, visitor_id) VALUES (?, ?, ?)',
        [conversationId, chatbotId, visitorId]
      );
    } else {
      conversationId = conversation.id;
    }

    // Store visitor message
    const visitorMsgId = 'msg_' + Math.random().toString(36).substring(2, 15);
    await dbRun(
      'INSERT INTO messages (id, conversation_id, sender, message) VALUES (?, ?, ?, ?)',
      [visitorMsgId, conversationId, 'visitor', message]
    );

    // Fetch conversation history context for the AI prompt flow (limit to past 8 messages)
    const history = await dbAll(
      'SELECT sender, message FROM messages WHERE conversation_id = ? ORDER BY created_at ASC LIMIT 8',
      [conversationId]
    );

    // Generate response using OpenAI + RAG / Smart Fallback NLP
    const botResponseText = await generateChatbotResponse({
      chatbotId,
      botName: chatbot.bot_name,
      welcomeMessage: chatbot.welcome_message,
      promptOverride: chatbot.prompt_override,
      userMessage: message,
      conversationHistory: history
    });

    // Store bot response message
    const botMsgId = 'msg_' + Math.random().toString(36).substring(2, 15);
    await dbRun(
      'INSERT INTO messages (id, conversation_id, sender, message) VALUES (?, ?, ?, ?)',
      [botMsgId, conversationId, 'bot', botResponseText]
    );

    res.json({
      reply: botResponseText,
      conversationId
    });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ error: 'Failed to process chat conversation.' });
  }
});

// 2. DASHBOARD: GET ALL CONVERSATIONS FOR A CHATBOT
router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    // Verify business ownership
    const business = await dbGet('SELECT id FROM businesses WHERE user_id = ?', [req.user.id]);
    if (!business) {
      return res.status(404).json({ error: 'Business account not found.' });
    }

    const chatbot = await dbGet('SELECT id FROM chatbots WHERE business_id = ?', [business.id]);
    if (!chatbot) {
      return res.status(404).json({ error: 'Chatbot not found.' });
    }

    // Retrieve active conversations with latest message summary
    const conversations = await dbAll(
      `SELECT c.id, c.visitor_id, c.created_at, 
              (SELECT m.message FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_message,
              (SELECT m.created_at FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_message_time
       FROM conversations c
       WHERE c.chatbot_id = ?
       ORDER BY last_message_time DESC`,
      [chatbot.id]
    );

    res.json(conversations);
  } catch (error) {
    console.error('Fetch conversations error:', error);
    res.status(500).json({ error: 'Failed to retrieve active conversations.' });
  }
});

// 3. DASHBOARD: GET MESSAGES IN A SPECIFIC CONVERSATION
router.get('/conversations/:id/messages', authMiddleware, async (req, res) => {
  const conversationId = req.params.id;

  try {
    // Verify security: ensure the conversation belongs to the current user's business
    const authCheck = await dbGet(
      `SELECT c.id FROM conversations c
       JOIN chatbots cb ON c.chatbot_id = cb.id
       JOIN businesses b ON cb.business_id = b.id
       WHERE c.id = ? AND b.user_id = ?`,
      [conversationId, req.user.id]
    );

    if (!authCheck && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access to conversation history.' });
    }

    const messages = await dbAll(
      'SELECT id, sender, message, created_at FROM messages WHERE conversation_id = ? ORDER BY created_at ASC',
      [conversationId]
    );

    res.json(messages);
  } catch (error) {
    console.error('Fetch messages error:', error);
    res.status(500).json({ error: 'Failed to retrieve message logs.' });
  }
});

// 4. DASHBOARD: UPDATE CHATBOT STYLING & CUSTOMIZATION
router.put('/settings', authMiddleware, async (req, res) => {
  const { bot_name, theme_color, welcome_message, prompt_override } = req.body;

  if (!bot_name || !theme_color || !welcome_message) {
    return res.status(400).json({ error: 'Bot name, color, and welcome message are required.' });
  }

  try {
    const business = await dbGet('SELECT id FROM businesses WHERE user_id = ?', [req.user.id]);
    if (!business) {
      return res.status(404).json({ error: 'Business account not found.' });
    }

    const chatbot = await dbGet('SELECT id FROM chatbots WHERE business_id = ?', [business.id]);
    if (!chatbot) {
      return res.status(404).json({ error: 'Chatbot details not found.' });
    }

    await dbRun(
      `UPDATE chatbots 
       SET bot_name = ?, theme_color = ?, welcome_message = ?, prompt_override = ? 
       WHERE id = ?`,
      [bot_name, theme_color, welcome_message, prompt_override || null, chatbot.id]
    );

    res.json({
      message: 'Chatbot customization updated successfully.',
      chatbot: {
        id: chatbot.id,
        business_id: business.id,
        bot_name,
        theme_color,
        welcome_message,
        prompt_override
      }
    });
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ error: 'Failed to save configuration settings.' });
  }
});

export default router;
