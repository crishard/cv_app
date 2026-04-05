import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "./route";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    cV: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const mockAuth = vi.mocked(auth);
const mockFindMany = vi.mocked(prisma.cV.findMany);
const mockCreate = vi.mocked(prisma.cV.create);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/cv", () => {
  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValueOnce(null as never);

    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns CVs for the authenticated user", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "user-1" } } as never);
    const cvs = [{ id: "cv-1", title: "My CV", status: "DRAFT" }];
    mockFindMany.mockResolvedValueOnce(cvs as never);

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual(cvs);
    expect(mockFindMany).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        atsScore: true,
        templateId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });
});

describe("POST /api/cv", () => {
  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValueOnce(null as never);

    const req = new NextRequest("http://localhost/api/cv", {
      method: "POST",
      body: JSON.stringify({ title: "New CV", templateId: "modern" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 when title or templateId is missing", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "user-1" } } as never);

    const req = new NextRequest("http://localhost/api/cv", {
      method: "POST",
      body: JSON.stringify({ title: "" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("creates and returns a new CV", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "user-1" } } as never);
    const created = { id: "cv-new", title: "New CV", templateId: "modern", status: "DRAFT" };
    mockCreate.mockResolvedValueOnce(created as never);

    const req = new NextRequest("http://localhost/api/cv", {
      method: "POST",
      body: JSON.stringify({ title: "New CV", templateId: "modern" }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body).toEqual(created);
  });
});
