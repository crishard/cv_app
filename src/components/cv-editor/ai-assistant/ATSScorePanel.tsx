"use client";

import { useState } from "react";

interface ATSResult {
  score: number;
  breakdown: {
    keywords: number;
    formatting: number;
    completeness: number;
    impact: number;
  };
  suggestions: string[];
}

function ScoreBar({ label, value, max = 25 }: { label: string; value: number; max?: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{value}/{max}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-100">
        <div
          className="h-1.5 rounded-full bg-blue-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function scoreColor(score: number) {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-500";
}

export function ATSScorePanel({ cvText }: { cvText: string }) {
  const [result, setResult] = useState<ATSResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/ai/ats-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cvText }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Analysis failed. Please try again.");
      return;
    }

    setResult(await res.json());
  }

  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">ATS Score</h3>
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={loading}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze CV"}
        </button>
      </div>

      {error && (
        <p role="alert" className="mb-3 text-xs text-red-500">{error}</p>
      )}

      {result && (
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline gap-1">
            <span className={`text-5xl font-bold ${scoreColor(result.score)}`}>
              {result.score}
            </span>
            <span className="text-lg text-gray-400">/100</span>
          </div>

          <div className="flex flex-col gap-2">
            <ScoreBar label="Keywords" value={result.breakdown.keywords} />
            <ScoreBar label="Formatting" value={result.breakdown.formatting} />
            <ScoreBar label="Completeness" value={result.breakdown.completeness} />
            <ScoreBar label="Impact" value={result.breakdown.impact} />
          </div>

          {result.suggestions.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Suggestions</p>
              <ul className="flex flex-col gap-1">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="mt-0.5 text-blue-500">→</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
