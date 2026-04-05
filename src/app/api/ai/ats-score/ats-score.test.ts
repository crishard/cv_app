import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));

const mockCreate = vi.fn();
vi.mock("@/lib/openrouter", () => ({
  getAIClient: () => ({ chat: { completions: { create: mockCreate } } }),
  AI_MODEL: "test-model",
}));
vi.mock("@/lib/anthropic", () => ({
  ATS_SYSTEM_PROMPT: "system",
  PROMPTS: { atsScore: vi.fn().mockReturnValue("prompt") },
}));

import { auth } from "@/lib/auth";

const mockAuth = vi.mocked(auth);

const validScore = {
  score: 78,
  breakdown: { keywords: 20, formatting: 22, completeness: 18, impact: 18 },
  suggestions: ["Add more keywords", "Quantify achievements", "Expand summary"],
};

beforeEach(() => vi.clearAllMocks());

describe("POST /api/ai/ats-score", () => {
  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValueOnce(null as never);
    const req = new NextRequest("http://localhost/api/ai/ats-score", {
      method: "POST",
      body: JSON.stringify({ cvText: "Jane Doe engineer" }),
    });
    expect((await POST(req)).status).toBe(401);
  });

  it("returns 400 when cvText is missing", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "u1" } } as never);
    const req = new NextRequest("http://localhost/api/ai/ats-score", {
      method: "POST",
      body: JSON.stringify({}),
    });
    expect((await POST(req)).status).toBe(400);
  });

  it("returns parsed ATS score object", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "u1" } } as never);
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify(validScore) } }],
    } as never);

    const req = new NextRequest("http://localhost/api/ai/ats-score", {
      method: "POST",
      body: JSON.stringify({ cvText: "Jane Doe senior engineer..." }),
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.score).toBe(78);
    expect(body.suggestions).toHaveLength(3);
  });

  it("returns 502 when AI returns invalid JSON", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "u1" } } as never);
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: "not valid json" } }],
    } as never);

    const req = new NextRequest("http://localhost/api/ai/ats-score", {
      method: "POST",
      body: JSON.stringify({ cvText: "Jane Doe" }),
    });
    expect((await POST(req)).status).toBe(502);
  });
});
