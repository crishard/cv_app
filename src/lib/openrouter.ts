import OpenAI from "openai";

let _client: OpenAI | null = null;

export function getAIClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY!,
    });
  }
  return _client;
}

// Free models in priority order — if one is rate-limited, the next is tried
export const FREE_MODELS = [
  "google/gemini-2.0-flash-exp:free",
  "qwen/qwen-2.5-72b-instruct:free",
  "meta-llama/llama-3.3-70b-instruct:free",
];

export const AI_MODEL = FREE_MODELS[0];

type CreateParams = Parameters<OpenAI["chat"]["completions"]["create"]>[0];

export async function chatComplete(params: Omit<CreateParams, "model" | "stream">) {
  const client = getAIClient();
  for (const model of FREE_MODELS) {
    try {
      return await client.chat.completions.create({ ...params, model, stream: false });
    } catch (err: unknown) {
      const status = (err as { status?: number }).status;
      if (status === 429) continue;
      throw err;
    }
  }
  throw new Error("All free models are rate-limited. Try again in a moment.");
}

export async function chatStream(params: Omit<CreateParams, "model" | "stream">) {
  const client = getAIClient();
  for (const model of FREE_MODELS) {
    try {
      return await client.chat.completions.create({ ...params, model, stream: true });
    } catch (err: unknown) {
      const status = (err as { status?: number }).status;
      if (status === 429) continue;
      throw err;
    }
  }
  throw new Error("All free models are rate-limited. Try again in a moment.");
}
