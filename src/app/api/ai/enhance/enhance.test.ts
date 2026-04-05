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
  PROMPTS: { enhanceText: vi.fn().mockReturnValue("prompt") },
}));

import { auth } from "@/lib/auth";

const mockAuth = vi.mocked(auth);

beforeEach(() => vi.clearAllMocks());

describe("POST /api/ai/enhance", () => {
  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValueOnce(null as never);
    const req = new NextRequest("http://localhost/api/ai/enhance", {
      method: "POST",
      body: JSON.stringify({ field: "summary", content: "engineer" }),
    });
    expect((await POST(req)).status).toBe(401);
  });

  it("returns 400 when field or content is missing", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "u1" } } as never);
    const req = new NextRequest("http://localhost/api/ai/enhance", {
      method: "POST",
      body: JSON.stringify({ field: "summary" }),
    });
    expect((await POST(req)).status).toBe(400);
  });

  it("returns a streaming response when valid", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "u1" } } as never);

    async function* fakeStream() {
      yield { choices: [{ delta: { content: "Improved" } }] };
      yield { choices: [{ delta: { content: " text" } }] };
    }
    mockCreate.mockResolvedValueOnce(fakeStream() as never);

    const req = new NextRequest("http://localhost/api/ai/enhance", {
      method: "POST",
      body: JSON.stringify({ field: "summary", content: "engineer with 5 years" }),
    });
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/event-stream");
  });
});
