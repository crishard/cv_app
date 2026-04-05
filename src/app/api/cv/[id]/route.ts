import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

async function getOwnedCV(userId: string, cvId: string) {
  return prisma.cV.findFirst({ where: { id: cvId, userId } });
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const cv = await getOwnedCV(session.user.id, id);

  if (!cv) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.cV.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const cv = await getOwnedCV(session.user.id, id);
  if (!cv) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { title } = await req.json();
  if (!title?.trim()) return NextResponse.json({ error: "Title is required" }, { status: 400 });

  const updated = await prisma.cV.update({ where: { id }, data: { title: title.trim() } });
  return NextResponse.json(updated);
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const cv = await getOwnedCV(session.user.id, id);

  if (!cv) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data = await req.json();
  const updated = await prisma.cV.update({ where: { id }, data });

  return NextResponse.json(updated);
}
