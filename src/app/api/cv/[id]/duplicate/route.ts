import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const original = await prisma.cV.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!original) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const copy = await prisma.cV.create({
    data: {
      userId: session.user.id,
      title: `${original.title} (copy)`,
      templateId: original.templateId,
      data: original.data ?? {},
    },
  });

  return NextResponse.json(copy, { status: 201 });
}
