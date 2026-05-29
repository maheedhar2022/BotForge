import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbGet, dbRun } from '../database/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-production';

// REGISTER BUSINESS USER
router.post('/register', async (req, res) => {
  const { name, email, password, businessName, businessType } = req.body;

  if (!name || !email || !password || !businessName) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }

  try {
    // Check if user exists
    const existingUser = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    // Generate UUIDs
    const userId = 'user_' + Math.random().toString(36).substring(2, 15);
    const businessId = 'biz_' + Math.random().toString(36).substring(2, 15);
    const chatbotId = 'bot_' + Math.random().toString(36).substring(2, 15);

    // Hash password
    const passwordHash = bcrypt.hashSync(password, 10);

    // Create User, Business and Chatbot in a sequential flow
    await dbRun(
      'INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [userId, name, email, passwordHash, 'business']
    );

    await dbRun(
      'INSERT INTO businesses (id, user_id, name, type) VALUES (?, ?, ?, ?)',
      [businessId, userId, businessName, businessType || 'Other']
    );

    // Seed default welcome message and theme for new chatbots
    const welcomeMsg = `Hi! Welcome to ${businessName}. I'm your AI virtual assistant. How can I help you today?`;
    await dbRun(
      'INSERT INTO chatbots (id, business_id, bot_name, theme_color, welcome_message) VALUES (?, ?, ?, ?, ?)',
      [chatbotId, businessId, 'AI Assistant', '#6366f1', welcomeMsg]
    );

    // Generate JWT
    const token = jwt.sign({ id: userId, email, role: 'business' }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Account successfully registered.',
      token,
      user: { id: userId, name, email, role: 'business' }
    });
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({ error: 'Internal server registration error.' });
  }
});

// LOGIN USER
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password.' });
  }

  try {
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const isValidPassword = bcrypt.compareSync(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Successfully logged in.',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ error: 'Internal server login error.' });
  }
});

// GET CURRENT USER PROFILE & TENANT DETAILS
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await dbGet('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Fetch associated business and chatbot profile
    const business = await dbGet('SELECT * FROM businesses WHERE user_id = ?', [user.id]);
    let chatbot = null;

    if (business) {
      chatbot = await dbGet('SELECT * FROM chatbots WHERE business_id = ?', [business.id]);
    }

    res.json({
      user,
      business,
      chatbot
    });
  } catch (error) {
    console.error('Profile fetch failed:', error);
    res.status(500).json({ error: 'Internal server profile error.' });
  }
});

export default router;
