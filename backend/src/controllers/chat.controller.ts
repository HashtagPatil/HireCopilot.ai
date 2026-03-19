import { Request, Response } from 'express';
import { vectorStore } from '../utils/vectorStore';
import { AIService } from '../services/ai.service';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const chatWithRecruiter = async (req: Request, res: Response) => {
  try {
    const { message, contextId, type = "job" } = req.body;
    
    // 1. Get embedding for user query
    const queryEmbedding = await AIService.getEmbedding(message);

    // 2. Perform semantic search 
    // If user asks "give me best react developers", we can search candidate vectors.
    const searchResults = vectorStore.search(queryEmbedding, type as ('job' | 'candidate'), 3);
    
    const contextStr = searchResults.map(r => JSON.stringify(r.entry.metadata || r.entry.id)).join("\n");

    // 3. Call OpenAI for chat stream
    const systemPrompt = `You are HireCopilot, an AI recruiter assistant. Based on the user query and the following vector search context, reply helpfully. 
Context: ${contextStr}`;

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      stream: true,
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      res.write(`data: ${JSON.stringify({ content })}\n\n`);
    }
    res.write('event: end\ndata: {}\n\n');
    res.end();

  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to process chat request.' });
    }
  }
};
