"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCandidateEmail = exports.updateCandidateStatus = exports.uploadResume = void 0;
const client_1 = require("@prisma/client");
const ai_service_1 = require("../services/ai.service");
const vectorStore_1 = require("../utils/vectorStore");
const pdf_service_1 = require("../services/pdf.service");
const prisma = new client_1.PrismaClient();
const uploadResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobId } = req.body;
        const file = req.file;
        if (!file || !jobId) {
            return res.status(400).json({ error: 'File and jobId are required.' });
        }
        const job = yield prisma.job.findUnique({ where: { id: jobId } });
        if (!job)
            return res.status(404).json({ error: 'Job not found.' });
        // 1. Parse PDF
        const resumeText = yield pdf_service_1.PdfService.parsePdf(file.path);
        // 2. Generate Embedding
        const embedding = yield ai_service_1.AIService.getEmbedding(resumeText);
        // 3. Evaluate candidate against Job Description
        const jobDescriptionFull = `${job.title} \n ${job.description} \n Requirements: ${JSON.stringify(job.requirements)}`;
        const evaluation = yield ai_service_1.AIService.evaluateCandidate(resumeText, jobDescriptionFull);
        // 4. Save Candidate
        const resumeUrl = `/uploads/${file.filename}`;
        // Simple extraction for MVP (You'd typically use LLM to extract this neatly)
        const nameMatch = resumeText.split('\n').find(line => line.trim().length > 0 && line.length < 50) || 'Unknown Candidate';
        const candidate = yield prisma.candidate.create({
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
        vectorStore_1.vectorStore.addEmbedding({
            id: candidate.id,
            type: 'candidate',
            embedding,
            metadata: { name: candidate.name, jobId }
        });
        yield prisma.candidate.update({
            where: { id: candidate.id },
            data: { embeddingId: candidate.id }
        });
        res.status(201).json(candidate);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process resume.' });
    }
});
exports.uploadResume = uploadResume;
const updateCandidateStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const candidate = yield prisma.candidate.update({
            where: { id: id },
            data: { status }
        });
        res.json(candidate);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update candidate.' });
    }
});
exports.updateCandidateStatus = updateCandidateStatus;
const generateCandidateEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { type } = req.query;
        const candidate = yield prisma.candidate.findUnique({
            where: { id: id },
            include: { job: true }
        });
        if (!candidate)
            return res.status(404).json({ error: 'Candidate not found.' });
        const emailContent = yield ai_service_1.AIService.generateEmail(type, candidate.name, candidate.job.title);
        res.json({ email: emailContent });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate email.' });
    }
});
exports.generateCandidateEmail = generateCandidateEmail;
