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
exports.generateDescription = exports.getJobById = exports.getJobs = exports.createJob = void 0;
const client_1 = require("@prisma/client");
const ai_service_1 = require("../services/ai.service");
const vectorStore_1 = require("../utils/vectorStore");
const prisma = new client_1.PrismaClient();
const createJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, requirements, skills, experience, recruiterId } = req.body;
        // We can compute the embedding for the job description to match with candidates
        const combinedText = `${title} ${description} ${requirements} ${skills} ${experience}`;
        const embedding = yield ai_service_1.AIService.getEmbedding(combinedText);
        const job = yield prisma.job.create({
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
        vectorStore_1.vectorStore.addEmbedding({
            id: job.id,
            type: 'job',
            embedding,
            metadata: { title, recruiterId }
        });
        // Update with its own id as embeddingId (just for reference)
        yield prisma.job.update({
            where: { id: job.id },
            data: { embeddingId: job.id }
        });
        res.status(201).json(job);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create job.' });
    }
});
exports.createJob = createJob;
const getJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const recruiterId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!recruiterId)
            return res.status(401).json({ error: 'Unauthorized' });
        const jobs = yield prisma.job.findMany({
            where: { recruiterId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(jobs);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch jobs.' });
    }
});
exports.getJobs = getJobs;
const getJobById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const job = yield prisma.job.findUnique({
            where: { id: id },
            include: {
                candidates: {
                    orderBy: { matchScore: 'desc' }
                }
            }
        });
        if (!job)
            return res.status(404).json({ error: 'Job not found' });
        res.json(job);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch job.' });
    }
});
exports.getJobById = getJobById;
const generateDescription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role, skills, experience } = req.body;
        const description = yield ai_service_1.AIService.generateJobDescription(role, skills, experience);
        res.json({ description });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate job description.' });
    }
});
exports.generateDescription = generateDescription;
