import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AIService } from '../services/ai.service';
import { vectorStore } from '../utils/vectorStore';

const prisma = new PrismaClient();

export const createJob = async (req: Request, res: Response) => {
  try {
    const { title, description, requirements, skills, experience } = req.body;
    console.log(`Received createJob request: ${JSON.stringify({ title, recruiterId: (req as any).user?.id })}`);
    
    const recruiterId = (req as any).user?.id;
    if (!recruiterId) {
      console.warn('Unauthorized createJob attempt');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Create job first (don't block on AI)
    console.log('Creating job in Prisma...');
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
    console.log(`Job created: ${job.id}`);

    // Try to compute embedding (non-blocking if AI fails)
    try {
      console.log('Generating embedding...');
      const combinedText = `${title} ${description} ${requirements} ${skills} ${experience}`;
      const embedding = await AIService.getEmbedding(combinedText);
      console.log('Embedding generated. Storing in vector store...');
      vectorStore.addEmbedding({
        id: job.id,
        type: 'job',
        embedding,
        metadata: { title, recruiterId }
      });
      console.log('Updating job with embedding state...');
      await prisma.job.update({ where: { id: job.id }, data: { embeddingId: job.id } });
    } catch (embeddingErr: any) {
      console.warn('Job embedding skipped (AI unavailable):', embeddingErr.message);
      await prisma.job.update({ where: { id: job.id }, data: { embeddingId: job.id } });
    }

    res.status(201).json(job);
  } catch (error: any) {
    console.error('CRITICAL ERROR in createJob:', error);
    res.status(500).json({ error: 'Failed to create job.', details: error.message });
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
  } catch (error: any) {
    console.error("Error in getJobs:", error);
    res.status(500).json({ error: 'Failed to fetch jobs.', details: error.message });
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
