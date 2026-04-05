"use client";

import { ExperienceEntry } from "@/types/cv";
import { nanoid } from "@/lib/nanoid";

interface Props {
  data: ExperienceEntry[];
  onChange: (data: ExperienceEntry[]) => void;
}

function emptyEntry(): ExperienceEntry {
  return {
    id: nanoid(),
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    achievements: [],
  };
}

function EntryForm({
  entry,
  onChange,
  onRemove,
}: {
  entry: ExperienceEntry;
  onChange: (entry: ExperienceEntry) => void;
  onRemove: () => void;
}) {
  function update<K extends keyof ExperienceEntry>(field: K, value: ExperienceEntry[K]) {
    onChange({ ...entry, [field]: value });
  }

  function handleAchievements(raw: string) {
    update("achievements", raw.split("\n").filter(Boolean));
  }

  return (
    <div className="rounded-xl border p-4 flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor={`position-${entry.id}`} className="text-sm font-medium">Position *</label>
          <input id={`position-${entry.id}`} value={entry.position} onChange={(e) => update("position", e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={`company-${entry.id}`} className="text-sm font-medium">Company *</label>
          <input id={`company-${entry.id}`} value={entry.company} onChange={(e) => update("company", e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={`startDate-${entry.id}`} className="text-sm font-medium">Start Date</label>
          <input id={`startDate-${entry.id}`} placeholder="YYYY-MM" value={entry.startDate} onChange={(e) => update("startDate", e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={`endDate-${entry.id}`} className="text-sm font-medium">End Date</label>
          <input id={`endDate-${entry.id}`} placeholder="YYYY-MM" disabled={entry.current} value={entry.endDate} onChange={(e) => update("endDate", e.target.value)} className="rounded-md border px-3 py-2 text-sm disabled:bg-gray-50" />
          <label className="flex items-center gap-2 text-xs text-gray-500">
            <input type="checkbox" checked={entry.current} onChange={(e) => update("current", e.target.checked)} />
            Currently working here
          </label>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor={`desc-${entry.id}`} className="text-sm font-medium">Description</label>
        <textarea id={`desc-${entry.id}`} rows={2} value={entry.description} onChange={(e) => update("description", e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor={`ach-${entry.id}`} className="text-sm font-medium">Achievements (one per line)</label>
        <textarea id={`ach-${entry.id}`} rows={3} value={entry.achievements.join("\n")} onChange={(e) => handleAchievements(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
      </div>
      <button type="button" onClick={onRemove} className="self-end text-xs text-red-500 hover:underline">
        Remove
      </button>
    </div>
  );
}

export function ExperienceStep({ data, onChange }: Props) {
  function addEntry() {
    onChange([...data, emptyEntry()]);
  }

  function updateEntry(index: number, entry: ExperienceEntry) {
    const updated = [...data];
    updated[index] = entry;
    onChange(updated);
  }

  function removeEntry(index: number) {
    onChange(data.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Experience</h2>
      {data.map((entry, i) => (
        <EntryForm
          key={entry.id}
          entry={entry}
          onChange={(e) => updateEntry(i, e)}
          onRemove={() => removeEntry(i)}
        />
      ))}
      <button
        type="button"
        onClick={addEntry}
        className="rounded-md border border-dashed px-4 py-2 text-sm text-gray-500 hover:bg-gray-50"
      >
        + Add experience
      </button>
    </div>
  );
}
