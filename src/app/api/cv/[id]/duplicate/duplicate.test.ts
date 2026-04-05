import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    cV: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const mockAuth = vi.mocked(auth);
const mockFindFirst = vi.mocked(prisma.cV.findFirst);
const mockCreate = vi.mocked(prisma.cV.create);
const params = Promise.resolve({ id: "cv-1" });

beforeEach(() => vi.clearAllMocks());

describe("POST /api/cv/[id]/duplicate", () => {
  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValueOnce(null as never);
    const req = new NextRequest("http://localhost/api/cv/cv-1/duplicate", { method: "POST" });
    expect((await POST(req, { params })).status).toBe(401);
  });

  it("returns 404 when CV does not belong to the user", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "u1" } } as never);
    mockFindFirst.mockResolvedValueOnce(null);
    const req = new NextRequest("http://localhost/api/cv/cv-1/duplicate", { method: "POST" });
    expect((await POST(req, { params })).status).toBe(404);
  });

  it("creates a copy with a new title and returns 201", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "u1" } } as never);
    mockFindFirst.mockResolvedValueOnce({
      id: "cv-1",
      title: "My CV",
      templateId: "modern",
      data: {},
      userId: "u1",
    } as never);
    mockCreate.mockResolvedValueOnce({ id: "cv-2", title: "My CV (copy)" } as never);

    const req = new NextRequest("http://localhost/api/cv/cv-1/duplicate", { method: "POST" });
    const res = await POST(req, { params });
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.title).toBe("My CV (copy)");
  });
});
