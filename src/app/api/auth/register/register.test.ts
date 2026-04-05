import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed-password"),
  },
}));

import { prisma } from "@/lib/prisma";

const mockFindUnique = vi.mocked(prisma.user.findUnique);
const mockCreate = vi.mocked(prisma.user.create);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/auth/register", () => {
  it("returns 400 when required fields are missing", async () => {
    const req = new NextRequest("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email: "test@test.com" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 409 when email is already in use", async () => {
    mockFindUnique.mockResolvedValueOnce({ id: "existing" } as never);

    const req = new NextRequest("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "John",
        email: "john@test.com",
        password: "secret123",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(409);
  });

  it("creates user and returns 201 without exposing password", async () => {
    mockFindUnique.mockResolvedValueOnce(null);
    mockCreate.mockResolvedValueOnce({
      id: "user-1",
      name: "John",
      email: "john@test.com",
      password: "hashed-password",
    } as never);

    const req = new NextRequest("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "John",
        email: "john@test.com",
        password: "secret123",
      }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.password).toBeUndefined();
    expect(body.email).toBe("john@test.com");
  });
});
