"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TemplateGallery } from "@/components/templates/TemplateGallery";
import { TemplateId } from "@/types/cv";

export default function NewCVPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<TemplateId | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    if (!selected) return;
    setLoading(true);
    setError(null);

    const res = await fetch("/api/cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Untitled CV", templateId: selected }),
    });

    if (!res.ok) {
      setError("Failed to create CV. Please try again.");
      setLoading(false);
      return;
    }

    const cv = await res.json();
    router.push(`/cv/${cv.id}/edit`);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold">Choose a template</h1>
      <p className="mb-8 text-sm text-gray-500">
        All templates are ATS-optimized. You can change this later.
      </p>

      <TemplateGallery selected={selected} onSelect={setSelected} />

      {error && (
        <p className="mt-4 text-sm text-red-500">{error}</p>
      )}

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleCreate}
          disabled={!selected || loading}
          className="rounded-md bg-black px-6 py-2.5 text-sm font-medium text-white disabled:opacity-40"
        >
          {loading ? "Creating..." : "Continue →"}
        </button>
      </div>
    </main>
  );
}
