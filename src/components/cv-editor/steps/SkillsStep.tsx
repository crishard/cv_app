"use client";

import { Skills, Language } from "@/types/cv";

interface Props {
  data: Skills;
  onChange: (data: Skills) => void;
}

const LEVELS = ["Basic", "Intermediate", "Advanced", "Fluent", "Native"] as const;

export function SkillsStep({ data, onChange }: Props) {
  function updateList(field: "technical" | "soft", raw: string) {
    onChange({ ...data, [field]: raw.split(",").map((s) => s.trim()).filter(Boolean) });
  }

  function addLanguage() {
    onChange({ ...data, languages: [...data.languages, { name: "", level: "Intermediate" }] });
  }

  function updateLanguage(index: number, field: keyof Language, value: string) {
    const updated = [...data.languages];
    updated[index] = { ...updated[index], [field]: value } as Language;
    onChange({ ...data, languages: updated });
  }

  function removeLanguage(index: number) {
    onChange({ ...data, languages: data.languages.filter((_, i) => i !== index) });
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-semibold">Skills</h2>
      <div className="flex flex-col gap-1">
        <label htmlFor="technical" className="text-sm font-medium">Technical Skills (comma-separated)</label>
        <textarea id="technical" rows={3} value={data.technical.join(", ")} onChange={(e) => updateList("technical", e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="soft" className="text-sm font-medium">Soft Skills (comma-separated)</label>
        <input id="soft" value={data.soft.join(", ")} onChange={(e) => updateList("soft", e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">Languages</p>
        {data.languages.map((lang, i) => (
          <div key={i} className="flex items-center gap-3">
            <input
              placeholder="Language"
              value={lang.name}
              onChange={(e) => updateLanguage(i, "name", e.target.value)}
              className="flex-1 rounded-md border px-3 py-2 text-sm"
            />
            <select
              value={lang.level}
              onChange={(e) => updateLanguage(i, "level", e.target.value)}
              className="rounded-md border px-3 py-2 text-sm"
            >
              {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <button type="button" onClick={() => removeLanguage(i)} className="text-xs text-red-500 hover:underline">
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addLanguage} className="self-start rounded-md border border-dashed px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50">
          + Add language
        </button>
      </div>
    </div>
  );
}
