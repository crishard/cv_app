import Link from "next/link";
import { CVStatus } from "@prisma/client";

type CV = {
  id: string;
  title: string;
  status: CVStatus;
  atsScore: number | null;
  templateId: string;
  updatedAt: Date;
};

const statusLabel: Record<CVStatus, string> = {
  DRAFT: "Draft",
  COMPLETE: "Complete",
  EXPORTED: "Exported",
};

export function CVList({ cvs }: { cvs: CV[] }) {
  if (cvs.length === 0) {
    return (
      <p className="text-gray-500">
        No CVs yet.{" "}
        <Link href="/cv/new" className="font-medium underline">
          Create your first one
        </Link>
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {cvs.map((cv) => (
        <li
          key={cv.id}
          className="flex items-center justify-between rounded-xl border bg-white px-5 py-4"
        >
          <div className="flex flex-col gap-1">
            <span className="font-medium">{cv.title}</span>
            <span className="text-xs text-gray-400">
              {statusLabel[cv.status]}
              {cv.atsScore !== null && (
                <> · ATS <strong>{cv.atsScore}</strong>/100</>
              )}
            </span>
          </div>
          <Link
            href={`/cv/${cv.id}/edit`}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            Edit
          </Link>
        </li>
      ))}
    </ul>
  );
}
