import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CVEditorWizard } from "@/components/cv-editor/CVEditorWizard";
import { ATSScorePanel } from "@/components/cv-editor/ai-assistant/ATSScorePanel";
import { CVData, TemplateId, EMPTY_CV_DATA } from "@/types/cv";
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

  const raw = cv.data as unknown as Partial<CVData> | null;
  const cvData: CVData = {
    ...EMPTY_CV_DATA,
    ...raw,
    personalInfo: { ...EMPTY_CV_DATA.personalInfo, ...(raw?.personalInfo ?? {}) },
    skills: { ...EMPTY_CV_DATA.skills, ...(raw?.skills ?? {}) },
  };

  async function handleSave(data: CVData) {
    "use server";
    const session = await auth();
    if (!session?.user?.id) return;
    await prisma.cV.update({ where: { id }, data: { data: data as never } });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b px-6 py-3">
        <Link href="/dashboard" className="text-sm text-gray-500 hover:underline">
          ← Dashboard
        </Link>
        <h1 className="font-semibold">{cv.title}</h1>
        <Link
          href={`/cv/${id}/preview`}
          className="rounded-md bg-black px-4 py-1.5 text-sm text-white"
        >
          Preview & Export
        </Link>
      </header>

      <div className="flex flex-1 gap-0">
        <main className="flex-1 overflow-y-auto p-8">
          <CVEditorWizard
            cvId={id}
            templateId={cv.templateId as TemplateId}
            initialData={cvData}
            onSave={handleSave}
          />
        </main>

        <aside className="w-80 shrink-0 border-l p-6">
          <ATSScorePanel cvText={cvDataToText(cvData)} />
        </aside>
      </div>
    </div>
  );
}
