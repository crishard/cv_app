import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: { cV: { findFirst: vi.fn() } },
}));
vi.mock("@/lib/pdf", () => ({
  generatePDF: vi.fn(),
  cvDataToText: vi.fn(),
}));

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generatePDF } from "@/lib/pdf";
import { EMPTY_CV_DATA } from "@/types/cv";

const mockAuth = vi.mocked(auth);
const mockFindFirst = vi.mocked(prisma.cV.findFirst);
const mockGeneratePDF = vi.mocked(generatePDF);

beforeEach(() => vi.clearAllMocks());

describe("POST /api/export/pdf", () => {
  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValueOnce(null as never);
    const req = new NextRequest("http://localhost/api/export/pdf", {
      method: "POST",
      body: JSON.stringify({ cvId: "cv-1" }),
    });
    expect((await POST(req)).status).toBe(401);
  });

  it("returns 404 when CV does not belong to the user", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "u1" } } as never);
    mockFindFirst.mockResolvedValueOnce(null);
    const req = new NextRequest("http://localhost/api/export/pdf", {
      method: "POST",
      body: JSON.stringify({ cvId: "cv-1" }),
    });
    expect((await POST(req)).status).toBe(404);
  });

  it("returns a PDF buffer with correct headers", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "u1" } } as never);
    mockFindFirst.mockResolvedValueOnce({
      id: "cv-1",
      title: "My CV",
      templateId: "modern",
      data: EMPTY_CV_DATA,
    } as never);
    mockGeneratePDF.mockResolvedValueOnce(Buffer.from("pdf-content"));

    const req = new NextRequest("http://localhost/api/export/pdf", {
      method: "POST",
      body: JSON.stringify({ cvId: "cv-1" }),
    });
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/pdf");
    expect(res.headers.get("content-disposition")).toContain("My_CV.pdf");
  });
});
