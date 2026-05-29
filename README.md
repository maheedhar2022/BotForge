# AI Chatbot SaaS Platform — MVP Launch Guide 🚀

OmniChat is a complete, high-fidelity multi-tenant **AI Chatbot SaaS Platform**. Small businesses can register accounts, customize chatbot aesthetics (names, colors, welcome messages), build custom knowledge bases via FAQs and PDF parsing with **RAG (Retrieval-Augmented Generation)**, capture visitor leads, track analytics, and embed their floating chatbot script on any external website.

---

## 🏗️ Technical Architecture & Highlights

- **Vite + React + Tailwind CSS**: Sleek glassmorphism dark mode, interactive preset sliders, and custom charting (no bulky charting libraries).
- **Node.js + Express Backend**: Secured by JWT cookie-less state tokens, serving direct multithreading PDF parsing.
- **Local SQLite DB + Supabase Path**: SQLite provides zero-config developer convenience while mapping perfectly to Supabase PostgreSQL (`schema.sql` included!).
- **API-Key & Docker Free RAG**: In-memory dense Cosine Similarity search matches intents instantly. If no `OPENAI_API_KEY` is present, our **Local NLP Fallback Engine** matches semantic keywords so the app remains fully conversational out of the box!

---

## ⚡ Quick Start — Run Locally

### 1. Configure Environmental Variables (Optional)
If you have an OpenAI account and want to test true GPT-4o-mini responses and semantic embeddings:
1. Open `backend/.env` file.
2. Enter your OpenAI credentials:
   ```env
   OPENAI_API_KEY=sk-proj-yourRealOpenAiKeyHere...
   ```
*(If left empty, the chatbot automatically boots in highly intelligent semantic fallback mode!)*

### 2. Launch Backend API Services
```bash
cd backend
npm install
npm start
```
*The API gateway and embeddable assets will boot up on **`http://localhost:5000`**.*

### 3. Launch Frontend Client Page
```bash
cd frontend
npm install
npm run dev
```
*The React developer loop will boot on **`http://localhost:3000`**.*

---

## 💡 Out-of-the-Box Demo Accounts

To make testing incredibly easy, we have pre-seeded the local database with two full accounts:

### 1. 🏋️ Business Tenant Account (FitLife Gym)
- **Email**: `owner@fitlife.com`
- **Password**: `business123`
- **What is pre-loaded**: Beautiful sky-blue branding, standard gym hours/locations FAQs, visitor test conversations, and captured customer leads.

### 2. 🛡️ System Admin Account
- **Email**: `admin@saas.com`
- **Password**: `admin123`
- **What is pre-loaded**: Comprehensive master metrics counter showing total system users, conversation counts, leads, and full tenant management directory.

---

## 🛠️ Testing the Embeddable Widget on Client Sites

We have created an absolute simulation showing how real businesses install your product:
1. Log in to `owner@fitlife.com`.
2. On your **Dashboard**, copy the copiable script tag in the right box.
3. Paste that script into any static HTML page (e.g. index.html or a test file) and open it.
4. You will see a beautiful floating chat bubble colored Sky Blue. Click it to launch the assistant, ask gym questions (e.g., "What are your hours?"), and submit lead contact cards!
