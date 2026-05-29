-- PostgreSQL / Supabase Schema Definition for AI Chatbot SaaS Platform

-- Drop tables if they exist (for easy resetting)
-- DROP TABLE IF EXISTS leads;
-- DROP TABLE IF EXISTS messages;
-- DROP TABLE IF EXISTS conversations;
-- DROP TABLE IF EXISTS documents;
-- DROP TABLE IF EXISTS chatbots;
-- DROP TABLE IF EXISTS businesses;
-- DROP TABLE IF EXISTS users;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'business', -- 'business' or 'admin'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Businesses Table
CREATE TABLE IF NOT EXISTS businesses (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT, -- e.g., 'Restaurant', 'Clinic', 'Gym'
  logo TEXT, -- URL or base64 representation
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Chatbots Table
CREATE TABLE IF NOT EXISTS chatbots (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL,
  bot_name TEXT NOT NULL DEFAULT 'AI Assistant',
  theme_color TEXT NOT NULL DEFAULT '#6366f1', -- Violet hex code
  welcome_message TEXT NOT NULL DEFAULT 'Hi! How can I help you today?',
  prompt_override TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

-- 4. Documents / Knowledge Base Table
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  chatbot_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL, -- 'faq', 'pdf', 'text'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chatbot_id) REFERENCES chatbots(id) ON DELETE CASCADE
);

-- 5. Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  chatbot_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL, -- Generated tracking token
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chatbot_id) REFERENCES chatbots(id) ON DELETE CASCADE
);

-- 6. Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender TEXT NOT NULL, -- 'bot' or 'visitor'
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

-- 7. Leads Table
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  chatbot_id TEXT NOT NULL,
  name TEXT,
  email TEXT,
  phone TEXT,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chatbot_id) REFERENCES chatbots(id) ON DELETE CASCADE
);
