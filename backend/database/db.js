import sqlite3 from 'sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'chatbot.db');

// Open the SQLite database with verbose errors
const db = new sqlite3.Database(dbPath);

// ─── Promise wrappers ────────────────────────────────────────────────────────

export const dbRun = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });

export const dbGet = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

export const dbAll = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

// exec() runs the full SQL string (handles comments, semicolons, multi-stmt)
const dbExec = (sql) =>
  new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

// ─── Inline schema (avoids fs/parsing issues entirely) ───────────────────────

const SCHEMA_SQL = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'business',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS businesses (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT,
  logo TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chatbots (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL,
  bot_name TEXT NOT NULL DEFAULT 'AI Assistant',
  theme_color TEXT NOT NULL DEFAULT '#6366f1',
  welcome_message TEXT NOT NULL DEFAULT 'Hi! How can I help you today?',
  prompt_override TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  chatbot_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chatbot_id) REFERENCES chatbots(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  chatbot_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chatbot_id) REFERENCES chatbots(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  chatbot_id TEXT NOT NULL,
  name TEXT,
  email TEXT,
  phone TEXT,
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chatbot_id) REFERENCES chatbots(id) ON DELETE CASCADE
);
`;

// ─── Seeded demo data ────────────────────────────────────────────────────────

async function seedDemoData() {
  const adminEmail = 'admin@saas.com';
  const existing = await dbGet('SELECT id FROM users WHERE email = ?', [adminEmail]);
  if (existing) return; // already seeded

  console.log('🌱 Seeding demo accounts...');

  // Admin user
  const adminHash = bcrypt.hashSync('admin123', 10);
  await dbRun(
    'INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
    ['admin-user-uuid', 'SaaS Master Admin', adminEmail, adminHash, 'admin']
  );

  // Business user
  const bizHash = bcrypt.hashSync('business123', 10);
  await dbRun(
    'INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
    ['business-user-uuid', 'Alex Mercer', 'owner@fitlife.com', bizHash, 'business']
  );

  // Business entity
  await dbRun(
    'INSERT INTO businesses (id, user_id, name, type) VALUES (?, ?, ?, ?)',
    ['business-fitlife-uuid', 'business-user-uuid', 'FitLife Gym & Wellness', 'Gym/Fitness Center']
  );

  // Chatbot
  const chatbotId = 'chatbot-fitlife-uuid';
  await dbRun(
    'INSERT INTO chatbots (id, business_id, bot_name, theme_color, welcome_message) VALUES (?, ?, ?, ?, ?)',
    [
      chatbotId,
      'business-fitlife-uuid',
      'FitBot',
      '#0ea5e9',
      'Welcome to FitLife Gym! I am FitBot. Ask me about membership plans, operating hours, or booking personal trainers.'
    ]
  );

  // FAQ Documents
  const faqs = [
    {
      id: 'faq-1',
      question: 'What are your hours of operation?',
      answer: 'FitLife Gym is open 24/7 for VIP members. Regular members: Mon–Fri 5 AM–11 PM, Sat–Sun 6 AM–9 PM.'
    },
    {
      id: 'faq-2',
      question: 'How much do memberships cost?',
      answer:
        'Three tiers: Basic $29/month (standard access), Gold $49/month (24/7 + group classes + 1 guest pass), Platinum VIP $79/month (full access + unlimited guests + locker + 1 PT session).'
    },
    {
      id: 'faq-3',
      question: 'Do you offer personal training?',
      answer:
        'Yes! Certified trainers specialising in weight loss, strength, and rehab. Sessions from $60/hour or 5-pack for $250.'
    },
    {
      id: 'faq-4',
      question: 'Where are you located?',
      answer:
        '742 Evergreen Terrace, Suite 100 — opposite Central Plaza Shopping Mall. Free parking for members!'
    }
  ];

  for (const faq of faqs) {
    const content = `Question: ${faq.question}\nAnswer: ${faq.answer}`;
    await dbRun(
      'INSERT INTO documents (id, chatbot_id, filename, content, type) VALUES (?, ?, ?, ?, ?)',
      [faq.id, chatbotId, `faq_${faq.id}.txt`, content, 'faq']
    );
  }

  console.log('✅ Demo data seeded successfully.');
}

// ─── Public initialiser — call once before starting the HTTP server ──────────

export async function initDB() {
  console.log('🗄️  Initialising SQLite database...');
  await dbExec(SCHEMA_SQL);
  console.log('✅ Tables verified/created.');
  await seedDemoData();
}

export default db;
