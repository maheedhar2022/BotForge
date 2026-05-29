import express from 'express';
import { dbGet, dbRun, dbAll } from '../database/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// 1. PUBLIC ENDPOINT: SAVE COLLECTED LEAD (Called by widget)
router.post('/lead', async (req, res) => {
  const { chatbotId, name, email, phone, message } = req.body;

  if (!chatbotId) {
    return res.status(400).json({ error: 'Chatbot ID is required to capture lead.' });
  }

  if (!name && !email && !phone) {
    return res.status(400).json({ error: 'Please provide at least one contact detail (Name, Email, or Phone).' });
  }

  try {
    // Verify chatbot
    const chatbot = await dbGet('SELECT id FROM chatbots WHERE id = ?', [chatbotId]);
    if (!chatbot) {
      return res.status(404).json({ error: 'Chatbot not found.' });
    }

    const leadId = 'lead_' + Math.random().toString(36).substring(2, 15);

    await dbRun(
      'INSERT INTO leads (id, chatbot_id, name, email, phone, message) VALUES (?, ?, ?, ?, ?, ?)',
      [leadId, chatbotId, name || null, email || null, phone || null, message || null]
    );

    res.status(201).json({
      message: 'Lead contact information successfully captured.',
      leadId
    });
  } catch (error) {
    console.error('Lead generation capture failed:', error);
    res.status(500).json({ error: 'Failed to capture contact lead.' });
  }
});

// 2. PROTECTED ENDPOINT: GET ALL LEADS FOR CURRENT USER
router.get('/leads', authMiddleware, async (req, res) => {
  try {
    const business = await dbGet('SELECT id FROM businesses WHERE user_id = ?', [req.user.id]);
    if (!business) {
      return res.status(404).json({ error: 'Business account not found.' });
    }

    const chatbot = await dbGet('SELECT id FROM chatbots WHERE business_id = ?', [business.id]);
    if (!chatbot) {
      return res.status(404).json({ error: 'Chatbot details not found.' });
    }

    const leads = await dbAll(
      'SELECT id, name, email, phone, message, created_at FROM leads WHERE chatbot_id = ? ORDER BY created_at DESC',
      [chatbot.id]
    );

    res.json(leads);
  } catch (error) {
    console.error('Fetch leads error:', error);
    res.status(500).json({ error: 'Failed to retrieve captured leads.' });
  }
});

// 3. PROTECTED ENDPOINT: DELETE A LEAD
router.delete('/leads/:id', authMiddleware, async (req, res) => {
  const leadId = req.params.id;

  try {
    const business = await dbGet('SELECT id FROM businesses WHERE user_id = ?', [req.user.id]);
    if (!business) {
      return res.status(404).json({ error: 'Business account not found.' });
    }

    const chatbot = await dbGet('SELECT id FROM chatbots WHERE business_id = ?', [business.id]);
    if (!chatbot) {
      return res.status(404).json({ error: 'Chatbot details not found.' });
    }

    // Verify ownership
    const lead = await dbGet('SELECT id FROM leads WHERE id = ? AND chatbot_id = ?', [leadId, chatbot.id]);
    if (!lead && req.user.role !== 'admin') {
      return res.status(404).json({ error: 'Lead details not found or unauthorized.' });
    }

    await dbRun('DELETE FROM leads WHERE id = ?', [leadId]);

    res.json({ message: 'Lead record successfully removed.' });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ error: 'Failed to delete lead record.' });
  }
});

export default router;
