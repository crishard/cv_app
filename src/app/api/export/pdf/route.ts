import { NextRequest, NextResponse } from "next/server";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generatePDF } from "@/lib/pdf";
import { CVData, TemplateId } from "@/types/cv";
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { ClassicTemplate } from "@/components/templates/ClassicTemplate";
import { MinimalTemplate } from "@/components/templates/MinimalTemplate";

const TEMPLATES = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
};

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

  const Template = TEMPLATES[cv.templateId as TemplateId] ?? ModernTemplate;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>* { box-sizing: border-box; } body { margin: 0; font-family: Arial, sans-serif; }</style></head><body>${renderToStaticMarkup(createElement(Template, { data: cv.data as unknown as CVData }))}</body></html>`;

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
