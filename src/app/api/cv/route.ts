import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cvs = await prisma.cV.findMany({
    where: { userId: session.user.id },
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

  return NextResponse.json(cvs);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, templateId } = await req.json();

  if (!title || !templateId) {
    return NextResponse.json(
      { error: "title and templateId are required" },
      { status: 400 }
    );
  }

  const cv = await prisma.cV.create({
    data: {
      userId: session.user.id,
      title,
      templateId,
    },
  });

  return NextResponse.json(cv, { status: 201 });
}
