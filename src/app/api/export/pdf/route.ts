export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generatePDF } from "@/lib/pdf";
import { cvToHtml } from "@/lib/cv-to-html";
import { CVData, TemplateId } from "@/types/cv";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { cvId } = await req.json();

  const cv = await prisma.cV.findFirst({
    where: { id: cvId, userId: session.user.id },
  });

  if (!cv) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const html = cvToHtml(cv.data as unknown as CVData, cv.templateId as TemplateId);
  const pdf = await generatePDF(html);
  const filename = `${cv.title.replace(/[^a-z0-9]/gi, "_")}.pdf`;

  return new NextResponse(pdf, {
    status: 200,
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="${filename}"`,
    },
  });
}
