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
  PROMPTS: {
    generateBullets: vi.fn().mockReturnValue("prompt"),
    suggestSkills: vi.fn().mockReturnValue("prompt"),
  },
}));

import { auth } from "@/lib/auth";

const mockAuth = vi.mocked(auth);

beforeEach(() => vi.clearAllMocks());

describe("POST /api/ai/generate", () => {
  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValueOnce(null as never);
    const req = new NextRequest("http://localhost/api/ai/generate", {
      method: "POST",
      body: JSON.stringify({ type: "bullets", input: "built apis" }),
    });
    expect((await POST(req)).status).toBe(401);
  });

  it("returns 400 when type or input is missing", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "u1" } } as never);
    const req = new NextRequest("http://localhost/api/ai/generate", {
      method: "POST",
      body: JSON.stringify({ type: "bullets" }),
    });
    expect((await POST(req)).status).toBe(400);
  });

  it("returns generated content as a list", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "u1" } } as never);
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: "Led team of 5\nReduced latency by 30%" } }],
    } as never);

    const req = new NextRequest("http://localhost/api/ai/generate", {
      method: "POST",
      body: JSON.stringify({ type: "bullets", input: "managed backend team" }),
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.items).toEqual(["Led team of 5", "Reduced latency by 30%"]);
  });
});
