"use client";

import { Skills, Language } from "@/types/cv";
import { TagInput } from "../TagInput";

interface Props {
  data: Skills;
  onChange: (data: Skills) => void;
}

const LEVELS = ["Basic", "Intermediate", "Advanced", "Fluent", "Native"] as const;

const inputClass =
  "rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition";

export function SkillsStep({ data, onChange }: Props) {
  function updateLanguage(index: number, field: keyof Language, value: string) {
    const updated = [...data.languages];
    updated[index] = { ...updated[index], [field]: value } as Language;
    onChange({ ...data, languages: updated });
  }

  function addLanguage() {
    onChange({ ...data, languages: [...data.languages, { name: "", level: "Intermediate" }] });
  }

  function removeLanguage(index: number) {
    onChange({ ...data, languages: data.languages.filter((_, i) => i !== index) });
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold">Skills</h2>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="technical" className="text-sm font-medium text-zinc-700">
          Technical Skills
          <span className="ml-1 text-xs font-normal text-zinc-400">— press Enter or comma to add</span>
        </label>
        <TagInput
          id="technical"
          values={data.technical}
          onChange={(technical) => onChange({ ...data, technical })}
          placeholder="React, TypeScript, Node.js..."
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="soft" className="text-sm font-medium text-zinc-700">
          Soft Skills
          <span className="ml-1 text-xs font-normal text-zinc-400">— press Enter or comma to add</span>
        </label>
        <TagInput
          id="soft"
          values={data.soft}
          onChange={(soft) => onChange({ ...data, soft })}
          placeholder="Leadership, Communication..."
        />
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-zinc-700">Languages</p>
        {data.languages.length === 0 && (
          <p className="text-sm text-zinc-400">No languages added yet.</p>
        )}
        {data.languages.map((lang, i) => (
          <div key={i} className="flex items-center gap-3">
            <input
              placeholder="Language"
              value={lang.name}
              onChange={(e) => updateLanguage(i, "name", e.target.value)}
              className={`flex-1 ${inputClass}`}
            />
            <select
              value={lang.level}
              onChange={(e) => updateLanguage(i, "level", e.target.value)}
              className={inputClass}
            >
              {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <button type="button" onClick={() => removeLanguage(i)} className="text-xs text-red-500 hover:underline shrink-0">
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addLanguage}
          className="self-start rounded-lg border border-dashed border-zinc-300 px-3 py-1.5 text-sm text-zinc-500 hover:bg-zinc-50 transition"
        >
          + Add language
        </button>
      </div>
    </div>
  );
}
