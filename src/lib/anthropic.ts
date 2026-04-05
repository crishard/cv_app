import Anthropic from "@anthropic-ai/sdk";

let _client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _client;
}

export const ATS_SYSTEM_PROMPT = `You are an expert resume writer specializing in ATS (Applicant Tracking System) optimization.

Rules for all output:
- Use plain text only. No markdown, no asterisks, no hyphens as bullets.
- Start experience bullets with strong action verbs (Led, Built, Reduced, Increased, Delivered).
- Quantify results wherever possible (percentages, numbers, timeframes).
- Use industry-standard keywords naturally.
- Keep sentences concise and impactful.
- Never add fictional information — only improve what the user provides.`;

export const PROMPTS = {
  enhanceText: (field: string, content: string) =>
    `Improve the following CV ${field} for ATS optimization. Return only the improved text, nothing else.\n\n${content}`,

  generateBullets: (description: string) =>
    `Convert this job description into 3-5 strong achievement bullets for a CV. Each bullet must start with an action verb and include quantified results where possible. Return one bullet per line, no symbols.\n\n${description}`,

  suggestSkills: (jobTitle: string, existingSkills: string[]) =>
    `Suggest 10 relevant technical skills for a ${jobTitle} role. Existing skills: ${existingSkills.join(", ")}. Return only new skills not already listed, one per line.`,

  atsScore: (cvText: string) =>
    `Analyze this CV for ATS compatibility and return a JSON object with this exact shape:
{
  "score": <number 0-100>,
  "breakdown": {
    "keywords": <number 0-25>,
    "formatting": <number 0-25>,
    "completeness": <number 0-25>,
    "impact": <number 0-25>
  },
  "suggestions": [<string>, <string>, <string>]
}

CV content:
${cvText}`,

  keywordOptimizer: (cvText: string, jobDescription: string) =>
    `Compare this CV against the job description and suggest 5-10 keywords or phrases missing from the CV that would improve ATS matching. Return one keyword per line.\n\nCV:\n${cvText}\n\nJob Description:\n${jobDescription}`,
};
