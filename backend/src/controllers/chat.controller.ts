import { Request, Response } from 'express';
import { vectorStore } from '../utils/vectorStore';
import { AIService } from '../services/ai.service';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function generateOfflineResponse(message: string): string {
  const lowerMsg = message.toLowerCase();
  if (lowerMsg.includes('candidate') || lowerMsg.includes('applicant')) {
    return `Based on your recruitment data, I can see candidate information in the system. You can view all candidates in the Candidates section and filter by status (Shortlisted, Pending, Rejected, Hired). For AI-powered insights, please ensure the OpenAI API key is configured correctly.`;
  }
  if (lowerMsg.includes('job') || lowerMsg.includes('role') || lowerMsg.includes('position')) {
    return `I can see your job postings in the system. To search candidates for a specific role, go to Jobs → select a job → Manage Candidates. The AI scoring system will match candidates against your job requirements automatically once the API key is valid.`;
  }
  if (lowerMsg.includes('shortlist') || lowerMsg.includes('hire') || lowerMsg.includes('reject')) {
    return `To manage candidate statuses, go to Jobs → Click "Manage Candidates" on any job → Use the action buttons (Shortlist, Invite, Hire, Reject) in the candidate table. You can also filter by status and sort by match score.`;
  }
  return `I'm your AI Recruiter Assistant. I can help you find candidates, summarize applicants, and analyze your hiring pipeline. Currently operating with limited AI capability — for full AI features, configure the OpenAI API key. Use the Jobs and Candidates pages for full pipeline management.`;
}

export const chatWithRecruiter = async (req: Request, res: Response) => {
  // Set SSE headers first so we can always stream a response
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const { message, type = "candidate" } = req.body;

    if (!message) {
      res.write(`data: ${JSON.stringify({ content: "Please type a message." })}\n\n`);
      res.write('event: end\ndata: {}\n\n');
      return res.end();
    }

    // Get embedding
    let queryEmbedding: number[];
    try {
      queryEmbedding = await AIService.getEmbedding(message);
    } catch (e) {
      queryEmbedding = new Array(1536).fill(0);
    }

    // Vector search  
    const searchResults = vectorStore.search(queryEmbedding, type as ('job' | 'candidate'), 3);
    const contextStr = searchResults.map(r => JSON.stringify(r.entry.metadata || r.entry.id)).join("\n");

    // Check API key
    if (!process.env.OPENAI_API_KEY) {
      const fallback = generateOfflineResponse(message);
      res.write(`data: ${JSON.stringify({ content: fallback })}\n\n`);
      res.write('event: end\ndata: {}\n\n');
      return res.end();
    }

    const systemPrompt = `You are HireCopilot, an expert AI recruiter assistant. Help the recruiter with hiring decisions, candidate evaluation, and job requirements. Be concise and actionable.
${contextStr ? `\nRelevant data context:\n${contextStr}` : ''}`;

    try {
      const stream = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        stream: true,
        max_tokens: 500,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }
    } catch (aiError: any) {
      console.error('OpenAI chat error:', aiError.message);
      const fallback = generateOfflineResponse(message);
      res.write(`data: ${JSON.stringify({ content: fallback })}\n\n`);
    }

    res.write('event: end\ndata: {}\n\n');
    res.end();

  } catch (error: any) {
    console.error('Chat controller error:', error);
    if (!res.headersSent) {
      res.write(`data: ${JSON.stringify({ content: "Sorry, I encountered an error. Please try again." })}\n\n`);
    }
    res.write('event: end\ndata: {}\n\n');
    res.end();
  }
};
