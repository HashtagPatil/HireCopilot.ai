import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AIService } from '../services/ai.service';
import { vectorStore } from '../utils/vectorStore';
import { PdfService } from '../services/pdf.service';

const prisma = new PrismaClient();

export const uploadResume = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.body;
    const file = req.file;

    if (!file || !jobId) {
      return res.status(400).json({ error: 'File and jobId are required.' });
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return res.status(404).json({ error: 'Job not found.' });

    // 1. Parse PDF
    const resumeText = await PdfService.parsePdf(file.path);
    
    // 2. Generate Embedding
    const embedding = await AIService.getEmbedding(resumeText);

    // 3. Evaluate candidate against Job Description
    const jobDescriptionFull = `${job.title} \n ${job.description} \n Requirements: ${JSON.stringify(job.requirements)}`;
    const evaluation = await AIService.evaluateCandidate(resumeText, jobDescriptionFull);

    // 4. Save Candidate
    const resumeUrl = `/uploads/${file.filename}`;
    // Simple extraction for MVP (You'd typically use LLM to extract this neatly)
    const nameMatch = resumeText.split('\n').find(line => line.trim().length > 0 && line.length < 50) || 'Unknown Candidate';
    
    const candidate = await prisma.candidate.create({
      data: {
        name: nameMatch.trim(),
        email: 'extracted@example.com', // Mock
        resumeUrl,
        skills: [], // Mock extraction
        jobId,
        matchScore: evaluation.score,
        matchReason: evaluation.reason,
        status: evaluation.score > 75 ? 'shortlisted' : 'pending',
        embeddingId: 'pending'
      }
    });

    // 5. Save vector
    vectorStore.addEmbedding({
      id: candidate.id,
      type: 'candidate',
      embedding,
      metadata: { name: candidate.name, jobId }
    });

    await prisma.candidate.update({
      where: { id: candidate.id },
      data: { embeddingId: candidate.id }
    });

    res.status(201).json(candidate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process resume.' });
  }
};

export const updateCandidateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const candidate = await prisma.candidate.update({
      where: { id: id as string },
      data: { status }
    });
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update candidate.' });
  }
};

export const generateCandidateEmail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type } = req.query as { type: 'invite' | 'reject' };

    const candidate = await prisma.candidate.findUnique({
      where: { id: id as string },
      include: { job: true }
    });

    if (!candidate) return res.status(404).json({ error: 'Candidate not found.' });

    const emailContent = await AIService.generateEmail(type, candidate.name, (candidate as any).job.title);
    res.json({ email: emailContent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate email.' });
  }
};
