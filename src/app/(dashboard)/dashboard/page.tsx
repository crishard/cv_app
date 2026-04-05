import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CVList } from "@/components/dashboard/CVList";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const cvs = await prisma.cV.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      status: true,
      atsScore: true,
      templateId: true,
      updatedAt: true,
    },
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My CVs</h1>
        <Link
          href="/cv/new"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
        >
          New CV
        </Link>
      </div>
      <CVList cvs={cvs} />
    </main>
  );
}
