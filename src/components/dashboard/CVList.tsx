"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

function CVCard({ cv, onDelete }: { cv: CV; onDelete: (id: string) => void }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDuplicate() {
    setBusy(true);
    await fetch(`/api/cv/${cv.id}/duplicate`, { method: "POST" });
    setBusy(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm(`Delete "${cv.title}"?`)) return;
    setBusy(true);
    await fetch(`/api/cv/${cv.id}`, { method: "DELETE" });
    setBusy(false);
    onDelete(cv.id);
  }

  return (
    <li className="flex items-center justify-between rounded-xl border bg-white px-5 py-4">
      <div className="flex flex-col gap-1">
        <span className="font-medium">{cv.title}</span>
        <span className="text-xs text-gray-400">
          {statusLabel[cv.status]}
          {cv.atsScore !== null && (
            <> · ATS <strong>{cv.atsScore}</strong>/100</>
          )}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleDuplicate}
          disabled={busy}
          className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          Duplicate
        </button>
        <Link
          href={`/cv/${cv.id}/edit`}
          className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          disabled={busy}
          className="rounded-md border px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export function CVList({ cvs: initial }: { cvs: CV[] }) {
  const [cvs, setCVs] = useState(initial);

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
        <CVCard
          key={cv.id}
          cv={cv}
          onDelete={(id) => setCVs((prev) => prev.filter((c) => c.id !== id))}
        />
      ))}
    </ul>
  );
}
