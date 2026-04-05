import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CVData, TemplateId, mergeCVData } from "@/types/cv";
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { ClassicTemplate } from "@/components/templates/ClassicTemplate";
import { MinimalTemplate } from "@/components/templates/MinimalTemplate";
import { DownloadButton } from "@/components/dashboard/DownloadButton";

const TEMPLATES = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
};

type Props = { params: Promise<{ id: string }> };

export default async function PreviewPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const cv = await prisma.cV.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!cv) notFound();

  const Template = TEMPLATES[cv.templateId as TemplateId] ?? ModernTemplate;
  const cvData = mergeCVData(cv.data as unknown as Partial<CVData> | null);

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <header className="flex items-center justify-between border-b bg-white px-6 py-3">
        <Link href={`/cv/${id}/edit`} className="text-sm text-gray-500 hover:underline">
          ← Back to editor
        </Link>
        <h1 className="font-semibold">{cv.title}</h1>
        <DownloadButton cvId={id} />
      </header>

      <main className="flex flex-1 justify-center px-4 py-10">
        <div className="w-full max-w-[794px] shadow-lg">
          <Template data={cvData} />
        </div>
      </main>
    </div>
  );
}
