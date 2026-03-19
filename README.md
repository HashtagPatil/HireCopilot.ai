# 🤖 HireCopilot.ai

> **AI-powered recruitment platform** — screen, rank, and hire elite talent in minutes, not weeks.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://prisma.io)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql)](https://mysql.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?logo=openai)](https://platform.openai.com)

---

## 🌟 What is HireCopilot?

HireCopilot is a full-stack recruitment automation platform that replaces manual HR screening with AI. Recruiters post jobs, candidates apply with their resume, and the platform automatically evaluates match scores, generates shortlists, drafts emails, and provides an AI chat assistant for real-time hiring decisions.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🏠 **Landing Page** | Public careers page with live job listings — candidates can apply directly |
| 🔐 **Auth System** | JWT-based login/register for recruiters |
| 📋 **Job Management** | Create jobs with AI-generated descriptions (GPT-4o) |
| 📄 **Resume Upload** | Candidates upload PDF/DOC resumes — AI evaluates match score (0–100) |
| 🤖 **AI Ranking** | Automatic shortlisting based on skill and experience match |
| 💬 **AI Chat** | SSE-streaming AI recruiter assistant (OpenAI GPT-4o) |
| 📧 **Email Generator** | One-click invite/rejection email templates (AI + fallback) |
| 📊 **Dashboard** | Recruiter metrics, active jobs, candidate pipeline |
| 🎨 **Theme System** | 4 color themes (Zinc / Blue / Rose / Orange) applied globally |
| 🌙 **Responsive UI** | Fully mobile-responsive with Framer Motion animations |

---

## 🏗️ Tech Stack

### Frontend (`/frontend`)
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + custom CSS variables
- **UI Components**: shadcn/ui (Radix primitives)
- **Animations**: Framer Motion
- **State**: React hooks + cookies (auth token)
- **HTTP**: Axios with interceptors (`/src/lib/api.ts`)

### Backend (`/backend`)
- **Runtime**: Node.js + Express.js
- **Language**: TypeScript
- **ORM**: Prisma Client (MySQL)
- **Auth**: JWT (`jsonwebtoken`) + bcrypt
- **AI**: OpenAI SDK (embeddings, chat completions)
- **File Upload**: Multer (local `/uploads/` directory)
- **PDF Parsing**: `pdf-parse` (graceful fallback if fails)
- **Vector Search**: In-memory cosine similarity vector store

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8+ running locally
- (Optional) OpenAI API key for AI features

### 1. Clone the repo
```bash
git clone https://github.com/HashtagPatil/HireCopilot.ai.git
cd HireCopilot.ai
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env:
#   DATABASE_URL="mysql://root:password@localhost:3306/hirecopilot"
#   JWT_SECRET="your-secret-key"
#   OPENAI_API_KEY="sk-..."   # Optional — app works without it
#   PORT=8080

# Run database migrations
npx prisma migrate dev

# Start backend
npm run dev
# → Running on http://localhost:8080
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env.local (optional — defaults to localhost:8080)
echo "NEXT_PUBLIC_API_URL=http://localhost:8080/api" > .env.local

# Start frontend
npm run dev
# → Running on http://localhost:3000
```

---

## 📁 Project Structure

```
HireCopilot.ai/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # DB models: User, Job, Candidate
│   ├── src/
│   │   ├── controllers/           # auth, job, candidate, chat
│   │   ├── routes/                # Express route definitions
│   │   ├── middlewares/           # auth (JWT), multer (file upload)
│   │   ├── services/              # ai.service.ts, pdf.service.ts
│   │   └── utils/                 # vectorStore.ts (in-memory embeddings)
│   └── uploads/                   # Uploaded resumes (PDF/DOC)
│
└── frontend/
    └── src/
        ├── app/
        │   ├── page.tsx            # Landing page + public job listing
        │   ├── login/              # Recruiter login
        │   ├── register/           # Recruiter registration
        │   ├── dashboard/          # Recruiter dashboard (protected)
        │   ├── jobs/               # Job management (protected)
        │   ├── candidates/         # Candidate pipeline (protected)
        │   ├── chat/               # AI assistant (protected)
        │   ├── generator/          # AI job description generator (protected)
        │   ├── public-jobs/        # Public careers page (no login needed)
        │   └── candidate-dashboard/ # Candidate view (no login needed)
        ├── components/
        │   ├── Navbar.tsx          # Top nav with theme switcher
        │   ├── Sidebar.tsx         # Protected route sidebar
        │   ├── AppLayout.tsx       # Layout wrapper
        │   └── ui/                 # shadcn/ui components
        └── lib/
            └── api.ts              # Axios instance with auth interceptor
```

---

## 🔑 API Reference

### Public Endpoints (no auth)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a recruiter |
| `POST` | `/api/auth/login` | Login, returns JWT |
| `GET` | `/api/jobs/all` | List all public jobs |
| `GET` | `/api/jobs/:id` | Get job details |
| `POST` | `/api/candidates/upload` | Submit resume (name, email, jobId, file) |

### Protected Endpoints (requires `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/jobs` | Create a new job |
| `POST` | `/api/jobs/generate-description` | AI generate job description |
| `GET` | `/api/jobs` | Get recruiter's jobs |
| `GET` | `/api/candidates` | Get all candidates |
| `PATCH` | `/api/candidates/:id/status` | Update candidate status |
| `GET` | `/api/candidates/:id/email` | Generate invite/rejection email |
| `POST` | `/api/chat` | AI chat (SSE streaming) |

---

## 🎨 Theme System

The app supports 4 color themes that apply globally via CSS variables:

| Theme | Class | Colors |
|---|---|---|
| **Zinc** | `data-theme="zinc"` | Neutral gray |
| **Blue** | `data-theme="blue"` | Blue (default) |
| **Rose** | `data-theme="rose"` | Rose/pink |
| **Orange** | `data-theme="orange"` | Warm orange |

Change theme in the top Navbar → colour picker icon.

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'feat: add your feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT © 2026 [HireCopilot](https://github.com/HashtagPatil/HireCopilot.ai)

---

<div align="center">
  <strong>Built with ❤️ by the HireCopilot team</strong><br/>
  <sub>Powered by Next.js · Express · Prisma · OpenAI · shadcn/ui</sub>
</div>
