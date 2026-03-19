import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AIService } from '../services/ai.service';
import { vectorStore } from '../utils/vectorStore';

const prisma = new PrismaClient();

export const createJob = async (req: Request, res: Response) => {
  try {
    const { title, description, requirements, skills, experience, recruiterId } = req.body;

    // We can compute the embedding for the job description to match with candidates
    const combinedText = `${title} ${description} ${requirements} ${skills} ${experience}`;
    const embedding = await AIService.getEmbedding(combinedText);

    const job = await prisma.job.create({
      data: {
        title,
        description,
        requirements,
        skills,
        experience,
        recruiterId,
        embeddingId: 'pending', // Will update right after
      },
    });

    // Save embedding
    vectorStore.addEmbedding({
      id: job.id,
      type: 'job',
      embedding,
      metadata: { title, recruiterId }
    });

    // Update with its own id as embeddingId (just for reference)
    await prisma.job.update({
      where: { id: job.id },
      data: { embeddingId: job.id }
    });

    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create job.' });
  }
};

export const getJobs = async (req: Request, res: Response) => {
  try {
    const recruiterId = (req as any).user?.id;
    if (!recruiterId) return res.status(401).json({ error: 'Unauthorized' });

    const jobs = await prisma.job.findMany({
      where: { recruiterId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(jobs);
  } catch (error) {
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
