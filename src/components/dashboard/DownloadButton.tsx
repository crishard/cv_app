"use client";

import { useState } from "react";

export function DownloadButton({ cvId }: { cvId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/export/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cvId }),
    });

    if (!res.ok) {
      setError("Export failed. Please try again.");
      setLoading(false);
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cv.pdf";
    a.click();
    URL.revokeObjectURL(url);
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleDownload}
        disabled={loading}
        className="rounded-md bg-black px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? "Generating PDF..." : "⬇ Download PDF"}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
