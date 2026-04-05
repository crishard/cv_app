import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { anthropic, ATS_SYSTEM_PROMPT, PROMPTS } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { field, content } = await req.json();

  if (!field || !content) {
    return NextResponse.json({ error: "field and content are required" }, { status: 400 });
  }

  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system: ATS_SYSTEM_PROMPT,
    messages: [{ role: "user", content: PROMPTS.enhanceText(field, content) }],
  });

  return new NextResponse(stream.toReadableStream(), {
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-cache",
    },
  });
}
