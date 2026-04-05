"use client";

import { useState } from "react";

interface Props {
  field: string;
  content: string;
  onResult: (text: string) => void;
}

export function EnhanceButton({ field, content, onResult }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEnhance() {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/ai/enhance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field, content }),
    });

    if (!res.ok) {
      setError("Failed to enhance. Please try again.");
      setLoading(false);
      return;
    }

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      for (const line of chunk.split("\n")) {
        if (!line.startsWith("data: ")) continue;
        try {
          const parsed = JSON.parse(line.slice(6));
          if (parsed?.delta?.type === "text_delta") {
            accumulated += parsed.delta.text;
            onResult(accumulated);
          }
        } catch {
          // skip malformed SSE lines
        }
      }
    }

    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={handleEnhance}
        disabled={loading || !content.trim()}
        className="flex items-center gap-1.5 self-end rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
      >
        {loading ? "Enhancing..." : "✦ Enhance with AI"}
      </button>
      {error && (
        <p role="alert" className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
