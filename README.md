# 🌱 HireCopilot.ai

A production-grade AI-powered Recruiter Copilot SaaS platform designed to automate resume screening, perform semantic candidate searches, generate job descriptions, and intelligently shortlist candidates using OpenAI and Vector Embeddings.

![HireCopilot.ai Logo/Mockup](https://via.placeholder.com/800x400?text=HireCopilot.ai+Recruiter+SaaS)

## 🎯 Features

- **Automated Resume Screening**: Upload PDFs and DOCX resumes which are parsed and embedded into our local vector store.
- **AI Recruiter Chat**: Copilot-style streaming chat interface to search your candidates semantically (e.g., "Find the best React developers").
- **Job Description Generator**: Input requirements and instantly generate a formatted JD using AI.
- **Candidate Matching**: Vector cosine-similarity matching of candidate skills against active job postings.
- **AI Shortlisting**: Dedicated LLM evaluation providing a match score (0-100%) and personalized reasoning.
- **Smart Email Generator**: Automatically drafts customizable interview invite or rejection emails for candidates.

## 🧱 Architecture

The application is built locally focusing on clean architecture.

\`\`\`
Frontend (Next.js 14 App Router, Tailwind, ShadCN UI)
  ↓
Backend API (Node.js, Express, TypeScript)
  ↓
  ├─ AI Service (OpenAI API bindings)
  ├─ Document Service (PDF parsing & extraction)
  ├─ Local Vector Store (JSON-based memory store w/ Cosine Similarity)
  └─ Database (MySQL via Prisma ORM)
\`\`\`

## 🚀 Tech Stack

- **Frontend**: Next.js (React + TypeScript), Tailwind CSS, ShadCN UI, Recharts, Framer Motion
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, JWT Authentication
- **Database / Store**: MySQL (Primary), Local JSON Vector Store (Embeddings)
- **AI Integration**: OpenAI (Embeddings + Chat/Completions)
- **Storage**: Local Multer File Storage

---

## 💻 Running Locally

### 1. Prerequisites
- **Node.js** (v18+)
- **MySQL** running locally (e.g. `localhost:3306`)
- **OpenAI API Key**

### 2. Backend Setup
1. Open the \`backend\` folder:
   \`\`\`bash
   cd backend
   npm install
   \`\`\`
2. Configure environment variables in \`backend/.env\`:
   \`\`\`env
   PORT=5000
   DATABASE_URL="mysql://root:password@localhost:3306/hirecopilot"
   JWT_SECRET="your_jwt_secret"
   OPENAI_API_KEY="sk-your-openai-key"
   \`\`\`
3. Set up the Database:
   \`\`\`bash
   npx prisma generate
   npx prisma db push
   \`\`\`
4. Start the server:
   \`\`\`bash
   npm run dev
   \`\`\`
   _Runs on http://localhost:5000_

### 3. Frontend Setup
1. Open the \`frontend\` folder:
   \`\`\`bash
   cd frontend
   npm install
   \`\`\`
2. Configure environment variables in \`frontend/.env.local\`:
   \`\`\`env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   \`\`\`
3. Start the Next.js app:
   \`\`\`bash
   npm run dev
   \`\`\`
   _Runs on http://localhost:3000_

## 🧪 Testing the Application

1. Open \`localhost:3000\` and register a Recruiter Account.
2. Go to **Job Generator** and instruct the AI to build a job. Save it.
3. Open the **Jobs** tab, click your job, and upload a sample Resume PDF. The AI will parse it and score the match.
4. Visit the **AI Recruiter** tab and ask queries like "Summarize the latest candidate's experience".
5. Use the Actions inside the Candidate view to auto-generate rejection/invite emails.

Created by [@HashtagPatil](https://github.com/HashtagPatil) | MIT License
