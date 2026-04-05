import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAIClient, AI_MODEL } from "@/lib/openrouter";
import { ATS_SYSTEM_PROMPT, PROMPTS } from "@/lib/anthropic";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!checkRateLimit(session.user.id)) {
    return NextResponse.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });
  }

  const { field, content } = await req.json();

  if (!field || !content) {
    return NextResponse.json({ error: "field and content are required" }, { status: 400 });
  }

  const stream = await getAIClient().chat.completions.create({
    model: AI_MODEL,
    max_tokens: 1024,
    stream: true,
    messages: [
      { role: "system", content: ATS_SYSTEM_PROMPT },
      { role: "user", content: PROMPTS.enhanceText(field, content) },
    ],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content ?? "";
        if (delta) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text_delta", delta: { text: delta } })}\n\n`));
        }
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new NextResponse(readable, {
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-cache",
    },
  });
}
