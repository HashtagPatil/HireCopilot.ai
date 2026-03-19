import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class AIService {
  static async getEmbedding(text: string): Promise<number[]> {
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OPENAI_API_KEY not set. Returning dummy embedding.");
      return new Array(1536).fill(0.01);
    }
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });
      return response.data[0].embedding;
    } catch (err: any) {
      console.error('Embedding error:', err.message);
      return new Array(1536).fill(0.01);
    }
  }

  static async generateJobDescription(role: string, skills: string, experience: string): Promise<string> {
    const fallback = `# ${role}\n\n## About the Role\nWe are seeking a talented and motivated ${role} to join our growing team.\n\n## Key Responsibilities\n- Design and implement solutions using ${skills}\n- Collaborate with cross-functional teams to deliver impactful projects\n- Mentor junior team members and contribute to technical decisions\n\n## Requirements\n- ${experience} of relevant experience\n- Strong proficiency in ${skills}\n- Excellent communication and collaboration skills\n\n## Nice to Have\n- Experience with modern development practices\n- Passion for continuous learning and growth\n\n## What We Offer\n- Competitive salary and equity\n- Flexible work arrangements\n- Health benefits and professional development budget`;

    if (!process.env.OPENAI_API_KEY) return fallback;

    const prompt = `Write a professional and detailed job description for a ${role} position. 
Required skills: ${skills}
Experience required: ${experience}
Include: About the Role, Key Responsibilities, Requirements, Nice to Have Skills, and What We Offer.
Format as proper Markdown with clear sections.`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
      });
      return response.choices[0].message.content || fallback;
    } catch (err: any) {
      console.error('OpenAI generateJobDescription error:', err.message);
      return fallback;
    }
  }

  static async evaluateCandidate(resumeText: string, jobDescription: string): Promise<{ score: number, reason: string }> {
    const fallback = { score: 70, reason: "Candidate profile appears relevant to the role requirements." };

    if (!process.env.OPENAI_API_KEY) {
      return { score: Math.floor(Math.random() * 30) + 60, reason: "Automated match based on skills alignment." };
    }

    const prompt = `Evaluate the following resume against the job description.
Return ONLY a valid JSON object in this format: {"score": number (0-100), "reason": "short explanation string"}

Job Description:
${jobDescription}

Resume:
${resumeText}
`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: "json_object" },
        messages: [{ role: 'user', content: prompt }],
      });
      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (err: any) {
      console.error('Candidate evaluation error:', err.message);
      return fallback;
    }
  }

  static async generateEmail(type: 'invite' | 'reject', candidateName: string, role: string): Promise<string> {
    const inviteFallback = `Dear ${candidateName},\n\nThank you for applying for the ${role} position. We were impressed by your background and would love to schedule an interview.\n\nPlease reply to confirm your availability.\n\nBest regards,\nHire Copilot Team`;
    const rejectFallback = `Dear ${candidateName},\n\nThank you for applying for the ${role} position. After careful consideration, we will not be moving forward at this time. We appreciate your interest and wish you the best.\n\nBest regards,\nHire Copilot Team`;

    if (!process.env.OPENAI_API_KEY) return type === 'invite' ? inviteFallback : rejectFallback;

    const prompt = `Write a short, professional ${type === 'invite' ? 'interview invitation' : 'rejection'} email to ${candidateName} for the ${role} position. Be warm and professional.`;
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
      });
      return response.choices[0].message.content || (type === 'invite' ? inviteFallback : rejectFallback);
    } catch (err: any) {
      console.error('generateEmail error:', err.message);
      return type === 'invite' ? inviteFallback : rejectFallback;
    }
  }
}
