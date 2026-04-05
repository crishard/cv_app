import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { anthropic, ATS_SYSTEM_PROMPT, PROMPTS } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type, input, context } = await req.json();

  if (!type || !input) {
    return NextResponse.json({ error: "type and input are required" }, { status: 400 });
  }

  const prompt =
    type === "bullets"
      ? PROMPTS.generateBullets(input)
      : PROMPTS.suggestSkills(input, context ?? []);

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 512,
    system: ATS_SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  const items = text.split("\n").filter(Boolean);

  return NextResponse.json({ items });
}
