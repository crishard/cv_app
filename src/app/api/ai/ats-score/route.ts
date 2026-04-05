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

  const { cvText } = await req.json();

  if (!cvText) {
    return NextResponse.json({ error: "cvText is required" }, { status: 400 });
  }

  const completion = await getAIClient().chat.completions.create({
    model: AI_MODEL,
    max_tokens: 1024,
    messages: [
      { role: "system", content: ATS_SYSTEM_PROMPT },
      { role: "user", content: PROMPTS.atsScore(cvText) },
    ],
  });

  const text = completion.choices[0]?.message?.content ?? "";

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to parse AI response" }, { status: 502 });
  }
}
