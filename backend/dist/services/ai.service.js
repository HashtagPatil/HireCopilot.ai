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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
class AIService {
    static getEmbedding(text) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!process.env.OPENAI_API_KEY) {
                console.warn("OPENAI_API_KEY not set. Returning dummy embedding.");
                return new Array(1536).fill(0.01);
            }
            const response = yield openai.embeddings.create({
                model: 'text-embedding-3-small',
                input: text,
            });
            return response.data[0].embedding;
        });
    }
    static generateJobDescription(role, skills, experience) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!process.env.OPENAI_API_KEY) {
                return "Mock Job Description: Requires " + skills;
            }
            const prompt = `Write a professional job description for a ${role} position. 
Required skills: ${skills}
Experience required: ${experience}
Include:
- Responsibilities
- Requirements
- Skills
Format as Markdown.`;
            const response = yield openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
            });
            return response.choices[0].message.content || '';
        });
    }
    static evaluateCandidate(resumeText, jobDescription) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!process.env.OPENAI_API_KEY)
                return { score: 85, reason: "Mock reason due to missing API key." };
            const prompt = `Evaluate the following resume against the job description.
Return ONLY a valid JSON object in this format: {"score": number (0-100), "reason": "short explanation string"}

Job Description:
${jobDescription}

Resume:
${resumeText}
`;
            const response = yield openai.chat.completions.create({
                model: 'gpt-4o-mini',
                response_format: { type: "json_object" },
                messages: [{ role: 'user', content: prompt }],
            });
            try {
                return JSON.parse(response.choices[0].message.content || '{"score": 0, "reason": "parse error"}');
            }
            catch (_a) {
                return { score: 0, reason: "Invalid JSON from LLM" };
            }
        });
    }
    static generateEmail(type, candidateName, role) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!process.env.OPENAI_API_KEY)
                return "Mock email template.";
            const prompt = `Write a short, professional ${type === 'invite' ? 'interview invitation' : 'rejection'} email to ${candidateName} for the ${role} position.`;
            const response = yield openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
            });
            return response.choices[0].message.content || '';
        });
    }
}
exports.AIService = AIService;
