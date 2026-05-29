import express from 'express';
import { dbGet, dbRun, dbAll } from '../database/db.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply auth + admin guards to all endpoints in this router
router.use(authMiddleware);
router.use(adminMiddleware);

// 1. GET ALL PLATFORM TENANTS & CHATBOTS
router.get('/tenants', async (req, res) => {
  try {
    const tenants = await dbAll(
      `SELECT u.id as user_id, u.name, u.email, u.role, u.created_at as user_created,
              b.id as business_id, b.name as business_name, b.type as business_type,
              cb.id as chatbot_id, cb.bot_name, cb.theme_color,
              (SELECT COUNT(*) FROM leads WHERE chatbot_id = cb.id) as lead_count,
              (SELECT COUNT(*) FROM conversations WHERE chatbot_id = cb.id) as conversation_count
       FROM users u
       LEFT JOIN businesses b ON u.id = b.user_id
       LEFT JOIN chatbots cb ON b.id = cb.business_id
       ORDER BY u.created_at DESC`
    );

    res.json(tenants);
  } catch (error) {
    console.error('Fetch tenants error:', error);
    res.status(500).json({ error: 'Failed to retrieve platform tenants.' });
  }
});

// 2. GET SYSTEM-WIDE HIGH LEVEL ANALYTICS
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await dbGet('SELECT COUNT(*) as count FROM users');
    const totalBusinesses = await dbGet('SELECT COUNT(*) as count FROM businesses');
    const totalConversations = await dbGet('SELECT COUNT(*) as count FROM conversations');
    const totalMessages = await dbGet('SELECT COUNT(*) as count FROM messages');
    const totalLeads = await dbGet('SELECT COUNT(*) as count FROM leads');
    const totalDocuments = await dbGet('SELECT COUNT(*) as count FROM documents');

    // Fetch popular questions (top questions stored in FAQs or keyword logs)
    // We will extract questions from documents where type is 'faq' or count query patterns
    const popularFaqs = await dbAll(
      `SELECT id, filename, SUBSTR(content, 1, 60) as question_preview 
       FROM documents 
       WHERE type = 'faq' 
       LIMIT 5`
    );

    res.json({
      summary: {
        users: totalUsers.count,
        businesses: totalBusinesses.count,
        conversations: totalConversations.count,
        messages: totalMessages.count,
        leads: totalLeads.count,
        documents: totalDocuments.count
      },
      popularFaqs
    });
  } catch (error) {
    console.error('Fetch global stats error:', error);
    res.status(500).json({ error: 'Failed to compile platform metrics.' });
  }
});

// 3. DELETE/SUSPEND AN ABUSE USER OR TENANT
router.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;

  if (userId === req.user.id) {
    return res.status(400).json({ error: 'Self-deletion is not permitted.' });
  }

  try {
    const user = await dbGet('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({ error: 'Target user account not found.' });
    }

    // Cascade delete: SQLite schema foreign keys will automatically delete associated business, chatbot, logs
    await dbRun('DELETE FROM users WHERE id = ?', [userId]);

    res.json({ message: `Account for user '${user.name}' successfully deleted from SaaS platform.` });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user account.' });
  }
});

export default router;
