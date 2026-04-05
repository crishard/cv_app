"use client";

import { EducationEntry } from "@/types/cv";
import { nanoid } from "@/lib/nanoid";

interface Props {
  data: EducationEntry[];
  onChange: (data: EducationEntry[]) => void;
}

function emptyEntry(): EducationEntry {
  return { id: nanoid(), institution: "", degree: "", field: "", startDate: "", endDate: "" };
}

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
      {data.map((edu, i) => (
        <div key={edu.id} className="rounded-xl border p-4 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor={`inst-${edu.id}`} className="text-sm font-medium">Institution *</label>
              <input id={`inst-${edu.id}`} value={edu.institution} onChange={(e) => update(i, "institution", e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor={`degree-${edu.id}`} className="text-sm font-medium">Degree *</label>
              <input id={`degree-${edu.id}`} value={edu.degree} onChange={(e) => update(i, "degree", e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor={`field-${edu.id}`} className="text-sm font-medium">Field of Study</label>
              <input id={`field-${edu.id}`} value={edu.field} onChange={(e) => update(i, "field", e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor={`gpa-${edu.id}`} className="text-sm font-medium">GPA</label>
              <input id={`gpa-${edu.id}`} value={edu.gpa ?? ""} onChange={(e) => update(i, "gpa", e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor={`eStart-${edu.id}`} className="text-sm font-medium">Start Date</label>
              <input id={`eStart-${edu.id}`} placeholder="YYYY-MM" value={edu.startDate} onChange={(e) => update(i, "startDate", e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor={`eEnd-${edu.id}`} className="text-sm font-medium">End Date</label>
              <input id={`eEnd-${edu.id}`} placeholder="YYYY-MM" value={edu.endDate} onChange={(e) => update(i, "endDate", e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
            </div>
          </div>
          <button type="button" onClick={() => removeEntry(i)} className="self-end text-xs text-red-500 hover:underline">
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={addEntry} className="rounded-md border border-dashed px-4 py-2 text-sm text-gray-500 hover:bg-gray-50">
        + Add education
      </button>
    </div>
  );
}
