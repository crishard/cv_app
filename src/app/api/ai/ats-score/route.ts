import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAnthropicClient, ATS_SYSTEM_PROMPT, PROMPTS } from "@/lib/anthropic";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!checkRateLimit(session.user.id)) {
    return NextResponse.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });
  }

  const { cvText } = await req.json();

  if (!cvText) {
    return NextResponse.json({ error: "cvText is required" }, { status: 400 });
  }

  const message = await getAnthropicClient().messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system: ATS_SYSTEM_PROMPT,
    messages: [{ role: "user", content: PROMPTS.atsScore(cvText) }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  try {
    const result = JSON.parse(text);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to parse AI response" }, { status: 502 });
  }
}
