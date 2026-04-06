"use client";

import { EducationEntry } from "@/types/cv";
import { nanoid } from "@/lib/nanoid";
import { MonthYearInput } from "../MonthYearInput";
import { isStartAfterEnd } from "@/lib/date-utils";

interface Props {
  data: EducationEntry[];
  onChange: (data: EducationEntry[]) => void;
}

function emptyEntry(): EducationEntry {
  return { id: nanoid(), institution: "", degree: "", field: "", startDate: "", endDate: "" };
}

const inputClass =
  "rounded-md border border-zinc-300 px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition";

export function EducationStep({ data, onChange }: Props) {
  function addEntry() {
    onChange([...data, emptyEntry()]);
  }

  function update(index: number, field: keyof EducationEntry, value: string) {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  }

  function removeEntry(index: number) {
    onChange(data.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Education</h2>
      {data.length === 0 && (
        <p className="text-sm text-zinc-400">No education added yet. Click below to add.</p>
      )}
      {data.map((edu, i) => (
        <div key={edu.id} className="rounded-xl border border-zinc-200 p-4 flex flex-col gap-3 bg-white">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
              Education {i + 1}
            </span>
            <button type="button" onClick={() => removeEntry(i)} className="text-xs text-red-500 hover:underline">
              Remove
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor={`inst-${edu.id}`} className="text-sm font-medium text-zinc-700">
                Institution <span className="text-red-500">*</span>
              </label>
              <input
                id={`inst-${edu.id}`}
                value={edu.institution}
                placeholder="University of Example"
                onChange={(e) => update(i, "institution", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor={`degree-${edu.id}`} className="text-sm font-medium text-zinc-700">
                Degree <span className="text-red-500">*</span>
              </label>
              <input
                id={`degree-${edu.id}`}
                value={edu.degree}
                placeholder="Bachelor's, Master's..."
                onChange={(e) => update(i, "degree", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor={`field-${edu.id}`} className="text-sm font-medium text-zinc-700">Field of Study</label>
              <input
                id={`field-${edu.id}`}
                value={edu.field}
                placeholder="Computer Science"
                onChange={(e) => update(i, "field", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor={`gpa-${edu.id}`} className="text-sm font-medium text-zinc-700">GPA</label>
              <input
                id={`gpa-${edu.id}`}
                value={edu.gpa ?? ""}
                placeholder="3.8"
                onChange={(e) => update(i, "gpa", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor={`eStart-${edu.id}`} className="text-sm font-medium text-zinc-700">Start Date</label>
              <MonthYearInput
                id={`eStart-${edu.id}`}
                value={edu.startDate}
                onChange={(v) => update(i, "startDate", v)}
                error={isStartAfterEnd(edu.startDate, edu.endDate) ? " " : null}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor={`eEnd-${edu.id}`} className="text-sm font-medium text-zinc-700">End / Expected Date</label>
              <MonthYearInput
                id={`eEnd-${edu.id}`}
                value={edu.endDate}
                onChange={(v) => update(i, "endDate", v)}
                error={isStartAfterEnd(edu.startDate, edu.endDate) ? "End must be after start date" : null}
              />
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addEntry}
        className="rounded-lg border border-dashed border-zinc-300 px-4 py-3 text-sm text-zinc-500 hover:bg-zinc-50 transition"
      >
        + Add education
      </button>
    </div>
  );
}
