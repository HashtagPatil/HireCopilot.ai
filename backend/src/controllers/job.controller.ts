import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AIService } from '../services/ai.service';
import { vectorStore } from '../utils/vectorStore';

const prisma = new PrismaClient();

export const createJob = async (req: Request, res: Response) => {
  try {
    const { title, description, requirements, skills, experience } = req.body;
    const recruiterId = (req as any).user?.id;

    if (!recruiterId) return res.status(401).json({ error: 'Unauthorized' });

    // Create job first (don't block on AI)
    const job = await prisma.job.create({
      data: {
        title,
        description,
        requirements,
        skills,
        experience,
        recruiterId,
        embeddingId: 'pending',
      },
    });

    // Try to compute embedding (non-blocking if AI fails)
    try {
      const combinedText = `${title} ${description} ${requirements} ${skills} ${experience}`;
      const embedding = await AIService.getEmbedding(combinedText);
      vectorStore.addEmbedding({
        id: job.id,
        type: 'job',
        embedding,
        metadata: { title, recruiterId }
      });
      await prisma.job.update({ where: { id: job.id }, data: { embeddingId: job.id } });
    } catch (embeddingErr) {
      console.warn('Job embedding skipped (AI unavailable):', (embeddingErr as Error).message);
      await prisma.job.update({ where: { id: job.id }, data: { embeddingId: job.id } });
    }

    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create job.' });
  }
};


export const getJobs = async (req: Request, res: Response) => {
  try {
    const recruiterId = (req as any).user?.id;
    
    const whereClause = recruiterId ? { recruiterId } : {};

    console.log(`Fetching jobs. Filter: ${JSON.stringify(whereClause)}`);
    const jobs = await prisma.job.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });
    console.log(`Found ${jobs.length} jobs`);
    res.json(jobs);
  } catch (error) {
    console.error("Error in getJobs:", error);
    res.status(500).json({ error: 'Failed to fetch jobs.' });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const job = await prisma.job.findUnique({
      where: { id: id as string },
      include: {
        candidates: {
          orderBy: { matchScore: 'desc' }
        }
      }
    });

    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch job.' });
  }
};

export const generateDescription = async (req: Request, res: Response) => {
  try {
    const { role, skills, experience } = req.body;
    const description = await AIService.generateJobDescription(role, skills, experience);
    res.json({ description });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate job description.' });
  }
};
