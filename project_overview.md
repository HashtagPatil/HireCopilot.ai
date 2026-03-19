# HireCopilot.ai Project Overview

## 🤖 Core Mission
HireCopilot.ai is an end-to-end AI recruitment automation platform designed to streamline the hiring process from job creation to candidate shortlisting.

## 🛠️ Tech Stack
- **Frontend**: Next.js 16 (App Router), Tailwind CSS v4, Framer Motion, shadcn/ui.
- **Backend**: Node.js, Express, TypeScript, Prisma (MySQL).
- **AI Integration**: OpenAI (GPT-4o) for job descriptions, evaluation, and chat assistant.
- **Storage**: MySQL for structured data, local storage for uploaded resumes.

## 🌟 Key Features
1. **AI Job Generator**: Create comprehensive job descriptions in seconds using AI.
2. **Automated Screening**: Resumes are parsed and scored automatically against job requirements.
3. **AI Chat Assistant**: A dedicated chat interface for recruiters to query their candidate pipeline.
4. **Public Careers Page**: A dynamic landing page showing live job opportunities with an integrated application flow.
5. **Theme System**: Real-time theme switching (Zinc, Blue, Rose, Orange) to match industrial aesthetic.

## 📁 Critical Files
- `backend/src/index.ts`: Server entry point & configuration.
- `backend/prisma/schema.prisma`: Database schema definition.
- `frontend/src/lib/api.ts`: Centralized API client.
- `frontend/src/app/page.tsx`: Landing page & Public apply flow.
- `backend/src/controllers/job.controller.ts`: Job management logic.

## 🚀 How to Run
1. **Backend**: `cd backend && npm install && npm run dev`
2. **Frontend**: `cd frontend && npm install && npm run dev`

*Ensure MySQL is running and `.env` files are configured.*
