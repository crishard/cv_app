import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { DELETE, PUT } from "./route";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    cV: {
      findFirst: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const mockAuth = vi.mocked(auth);
const mockFindFirst = vi.mocked(prisma.cV.findFirst);
const mockDelete = vi.mocked(prisma.cV.delete);
const mockUpdate = vi.mocked(prisma.cV.update);

const params = Promise.resolve({ id: "cv-1" });

beforeEach(() => {
  vi.clearAllMocks();
});

describe("DELETE /api/cv/[id]", () => {
  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValueOnce(null as never);

    const req = new NextRequest("http://localhost/api/cv/cv-1", { method: "DELETE" });
    const res = await DELETE(req, { params });

    expect(res.status).toBe(401);
  });

  it("returns 404 when CV does not belong to the user", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "user-1" } } as never);
    mockFindFirst.mockResolvedValueOnce(null);

    const req = new NextRequest("http://localhost/api/cv/cv-1", { method: "DELETE" });
    const res = await DELETE(req, { params });

    expect(res.status).toBe(404);
  });

  it("deletes the CV and returns 204", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "user-1" } } as never);
    mockFindFirst.mockResolvedValueOnce({ id: "cv-1" } as never);
    mockDelete.mockResolvedValueOnce({} as never);

    const req = new NextRequest("http://localhost/api/cv/cv-1", { method: "DELETE" });
    const res = await DELETE(req, { params });

    expect(res.status).toBe(204);
    expect(mockDelete).toHaveBeenCalledWith({ where: { id: "cv-1" } });
  });
});

describe("PUT /api/cv/[id]", () => {
  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValueOnce(null as never);

    const req = new NextRequest("http://localhost/api/cv/cv-1", {
      method: "PUT",
      body: JSON.stringify({ title: "Updated" }),
    });
    const res = await PUT(req, { params });

    expect(res.status).toBe(401);
  });

  it("returns 404 when CV does not belong to the user", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "user-1" } } as never);
    mockFindFirst.mockResolvedValueOnce(null);

    const req = new NextRequest("http://localhost/api/cv/cv-1", {
      method: "PUT",
      body: JSON.stringify({ title: "Updated" }),
    });
    const res = await PUT(req, { params });

    expect(res.status).toBe(404);
  });

  it("updates and returns the CV", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "user-1" } } as never);
    mockFindFirst.mockResolvedValueOnce({ id: "cv-1" } as never);
    const updated = { id: "cv-1", title: "Updated" };
    mockUpdate.mockResolvedValueOnce(updated as never);

    const req = new NextRequest("http://localhost/api/cv/cv-1", {
      method: "PUT",
      body: JSON.stringify({ title: "Updated" }),
    });
    const res = await PUT(req, { params });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual(updated);
  });
});
