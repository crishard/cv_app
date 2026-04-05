import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { chatComplete } from "@/lib/openrouter";
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

  const { type, input, context } = await req.json();

  if (!type || !input) {
    return NextResponse.json({ error: "type and input are required" }, { status: 400 });
  }

  const prompt =
    type === "bullets"
      ? PROMPTS.generateBullets(input)
      : PROMPTS.suggestSkills(input, context ?? []);

  const completion = await chatComplete({
    max_tokens: 512,
    messages: [
      { role: "system", content: ATS_SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
  });

  const text = completion.choices[0]?.message?.content ?? "";
  const items = text.split("\n").filter(Boolean);

  return NextResponse.json({ items });
}
