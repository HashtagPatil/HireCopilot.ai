import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AIService } from '../services/ai.service';
import { vectorStore } from '../utils/vectorStore';
import { PdfService } from '../services/pdf.service';

const prisma = new PrismaClient();

export const uploadResume = async (req: Request, res: Response) => {
  try {
    const { jobId, name, email } = req.body;
    const file = req.file;

    if (!file || !jobId) {
      return res.status(400).json({ error: 'File and jobId are required.' });
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return res.status(404).json({ error: 'Job not found.' });

    // 1. Parse PDF (graceful fallback)
    let resumeText = `Resume submitted by ${name || 'Unknown'}. Email: ${email || 'unknown@example.com'}.`;
    try {
      const parsed = await PdfService.parsePdf(file.path);
      if (parsed && parsed.length > 50) resumeText = parsed;
    } catch (pdfErr) {
      console.warn('PDF parsing failed, using fallback text');
    }

    // 2. AI evaluation (graceful fallback)
    let matchScore = 50;
    let matchReason = 'Application submitted. Manual review required.';
    try {
      const embedding = await AIService.getEmbedding(resumeText);
      const jobDescriptionFull = `${job.title} \n ${job.description} \n Requirements: ${JSON.stringify(job.requirements)}`;
      const evaluation = await AIService.evaluateCandidate(resumeText, jobDescriptionFull);
      matchScore = evaluation.score;
      matchReason = evaluation.reason;

      vectorStore.addEmbedding({
        id: jobId + '_' + Date.now(),
        type: 'candidate',
        embedding,
        metadata: { name: name || 'Unknown', jobId }
      });
    } catch (aiErr) {
      console.warn('AI evaluation skipped (AI unavailable):', (aiErr as Error).message);
    }

    // 3. Save Candidate using name/email from form
    const resumeUrl = `/uploads/${file.filename}`;
    const candidateName = name?.trim() || resumeText.split('\n').find(l => l.trim().length > 0 && l.length < 50) || 'Unknown Candidate';
    const candidateEmail = email?.trim() || 'applicant@example.com';

    const candidate = await prisma.candidate.create({
      data: {
        name: candidateName,
        email: candidateEmail,
        resumeUrl,
        skills: [],
        jobId,
        matchScore,
        matchReason,
        status: matchScore > 75 ? 'shortlisted' : 'pending',
        embeddingId: jobId
      }
    });

    await prisma.candidate.update({
      where: { id: candidate.id },
      data: { embeddingId: candidate.id }
    });

    res.status(201).json(candidate);
  } catch (error) {
    console.error('RESUME_UPLOAD_ERROR:', error);
    res.status(500).json({ error: 'Failed to process resume. Check server logs.' });
  }
};

export const getCandidates = async (req: Request, res: Response) => {
  try {
    const recruiterId = (req as any).user?.id;
    const { jobId } = req.query;

    const where: any = {};
    if (jobId) where.jobId = jobId;
    if (recruiterId) {
      where.job = { recruiterId };
    }

    const candidates = await prisma.candidate.findMany({
      where,
      include: { job: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch candidates.' });
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

    try {
      const emailContent = await AIService.generateEmail(type, candidate.name, (candidate as any).job.title);
      res.json({ email: emailContent });
    } catch (aiErr) {
      // Fallback email template
      const templates: Record<string, string> = {
        invite: `Dear ${candidate.name},\n\nWe are pleased to invite you for an interview for the ${(candidate as any).job?.title} position. Please reply to schedule a convenient time.\n\nBest regards,\nHireCopilot Team`,
        reject: `Dear ${candidate.name},\n\nThank you for your interest in the ${(candidate as any).job?.title} position. After careful consideration, we have decided to move forward with other candidates.\n\nWe wish you the best in your job search.\n\nBest regards,\nHireCopilot Team`
      };
      res.json({ email: templates[type] || templates['invite'] });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate email.' });
  }
};
