import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Load environment variables FIRST
dotenv.config();

import { initDB, dbGet } from './database/db.js';
import { initializeVectorCache } from './services/vector.js';

// Route Imports
import authRouter from './routes/auth.js';
import chatRouter from './routes/chat.js';
import uploadRouter from './routes/upload.js';
import leadsRouter from './routes/leads.js';
import adminRouter from './routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve embeddable widget assets
app.use(express.static(join(__dirname, 'public')));

// ── Public API: fetch chatbot config (no auth needed by widget) ───────────────
app.get('/api/public/chatbot/:id', async (req, res) => {
  try {
    const chatbot = await dbGet(
      'SELECT id, bot_name, theme_color, welcome_message FROM chatbots WHERE id = ?',
      [req.params.id]
    );
    if (!chatbot) return res.status(404).json({ error: 'Chatbot not found.' });
    res.json(chatbot);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch public chatbot config.' });
  }
});

// ── Platform routes ───────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api', chatRouter);       // /chat, /settings, /conversations
app.use('/api', uploadRouter);     // /upload-faq, /upload-pdf, /documents
app.use('/api', leadsRouter);      // /lead, /leads
app.use('/api/admin', adminRouter);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date(),
    openaiEnabled: process.env.OPENAI_API_KEY ? 'yes' : 'local-fallback'
  });
});

// ── Bootstrap (DB → Vectors → HTTP) ──────────────────────────────────────────
async function bootstrap() {
  try {
    // 1. Initialize DB tables and seed demo data
    await initDB();

    // 2. Build in-memory vector cache from documents table
    await initializeVectorCache();

    // 3. Start HTTP server only after everything is ready
    app.listen(PORT, () => {
      console.log('=========================================');
      console.log(`  AI Chatbot SaaS Backend running on:`);
      console.log(`  👉 http://localhost:${PORT}`);
      console.log('=========================================');
    });
  } catch (err) {
    console.error('❌ Fatal startup error:', err);
    process.exit(1);
  }
}

bootstrap();
