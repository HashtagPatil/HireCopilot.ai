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
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return response.data[0].embedding;
  }

  static async generateJobDescription(role: string, skills: string, experience: string): Promise<string> {
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

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });
    return response.choices[0].message.content || '';
  }

  static async evaluateCandidate(resumeText: string, jobDescription: string): Promise<{ score: number, reason: string }> {
    if (!process.env.OPENAI_API_KEY) return { score: 85, reason: "Mock reason due to missing API key." };
    
    const prompt = `Evaluate the following resume against the job description.
Return ONLY a valid JSON object in this format: {"score": number (0-100), "reason": "short explanation string"}

Job Description:
${jobDescription}

Resume:
${resumeText}
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: "json_object" },
      messages: [{ role: 'user', content: prompt }],
    });

    try {
      return JSON.parse(response.choices[0].message.content || '{"score": 0, "reason": "parse error"}');
    } catch {
      return { score: 0, reason: "Invalid JSON from LLM" };
    }
  }

  static async generateEmail(type: 'invite' | 'reject', candidateName: string, role: string): Promise<string> {
     if (!process.env.OPENAI_API_KEY) return "Mock email template.";
     const prompt = `Write a short, professional ${type === 'invite' ? 'interview invitation' : 'rejection'} email to ${candidateName} for the ${role} position.`;
     const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });
    return response.choices[0].message.content || '';
  }
}
