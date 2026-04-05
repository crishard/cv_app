import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CVEditorShell } from "@/components/cv-editor/CVEditorShell";
import { CVData, TemplateId, mergeCVData } from "@/types/cv";
import { cvDataToText } from "@/lib/pdf";

type Props = { params: Promise<{ id: string }> };

export default async function EditCVPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const cv = await prisma.cV.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!cv) notFound();

  const cvData = mergeCVData(cv.data as unknown as Partial<CVData> | null);

  async function handleSave(data: CVData) {
    "use server";
    const session = await auth();
    if (!session?.user?.id) return;
    await prisma.cV.update({ where: { id }, data: { data: data as never } });
  }

  return (
    <CVEditorShell
      cvId={id}
      initialTitle={cv.title}
      initialData={cvData}
      templateId={cv.templateId as TemplateId}
      onSave={handleSave}
      cvText={cvDataToText(cvData)}
    />
  );
}
