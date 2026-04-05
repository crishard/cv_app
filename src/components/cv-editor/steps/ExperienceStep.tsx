"use client";

import { ExperienceEntry } from "@/types/cv";
import { nanoid } from "@/lib/nanoid";
import { MonthYearInput } from "../MonthYearInput";

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

const inputClass =
  "rounded-md border border-zinc-300 px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition";
const inputErrorClass =
  "rounded-md border border-red-400 bg-red-50 px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-red-300 transition";

function EntryForm({
  entry,
  onChange,
  onRemove,
  index,
}: {
  entry: ExperienceEntry;
  onChange: (entry: ExperienceEntry) => void;
  onRemove: () => void;
  index: number;
}) {
  function update<K extends keyof ExperienceEntry>(field: K, value: ExperienceEntry[K]) {
    onChange({ ...entry, [field]: value });
  }

  function handleAchievements(raw: string) {
    update("achievements", raw.split("\n").filter(Boolean));
  }

  const positionInvalid = entry.position.length === 0;
  const companyInvalid = entry.company.length === 0;

  return (
    <div className="rounded-xl border border-zinc-200 p-4 flex flex-col gap-3 bg-white">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
          Position {index + 1}
        </span>
        <button type="button" onClick={onRemove} className="text-xs text-red-500 hover:underline">
          Remove
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor={`position-${entry.id}`} className="text-sm font-medium text-zinc-700">
            Position <span className="text-red-500">*</span>
          </label>
          <input
            id={`position-${entry.id}`}
            value={entry.position}
            placeholder="Software Engineer"
            onChange={(e) => update("position", e.target.value)}
            className={positionInvalid && entry.position !== "" ? inputErrorClass : inputClass}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={`company-${entry.id}`} className="text-sm font-medium text-zinc-700">
            Company <span className="text-red-500">*</span>
          </label>
          <input
            id={`company-${entry.id}`}
            value={entry.company}
            placeholder="Acme Inc."
            onChange={(e) => update("company", e.target.value)}
            className={companyInvalid && entry.company !== "" ? inputErrorClass : inputClass}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={`startDate-${entry.id}`} className="text-sm font-medium text-zinc-700">
            Start Date
          </label>
          <MonthYearInput
            id={`startDate-${entry.id}`}
            value={entry.startDate}
            onChange={(v) => update("startDate", v)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={`endDate-${entry.id}`} className="text-sm font-medium text-zinc-700">
            End Date
          </label>
          <MonthYearInput
            id={`endDate-${entry.id}`}
            value={entry.endDate}
            onChange={(v) => update("endDate", v)}
            disabled={entry.current}
          />
          <label className="flex items-center gap-2 text-xs text-zinc-500 mt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={entry.current}
              onChange={(e) => update("current", e.target.checked)}
              className="rounded"
            />
            Currently working here
          </label>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor={`desc-${entry.id}`} className="text-sm font-medium text-zinc-700">Description</label>
        <textarea
          id={`desc-${entry.id}`}
          rows={2}
          value={entry.description}
          placeholder="Brief description of your role and responsibilities..."
          onChange={(e) => update("description", e.target.value)}
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor={`ach-${entry.id}`} className="text-sm font-medium text-zinc-700">
          Achievements <span className="text-xs font-normal text-zinc-400">(one per line)</span>
        </label>
        <textarea
          id={`ach-${entry.id}`}
          rows={3}
          value={entry.achievements.join("\n")}
          placeholder="Increased revenue by 20%&#10;Led a team of 5 engineers&#10;Reduced load time by 40%"
          onChange={(e) => handleAchievements(e.target.value)}
          className={inputClass}
        />
      </div>
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
      {data.length === 0 && (
        <p className="text-sm text-zinc-400">No experience added yet. Click below to add.</p>
      )}
      {data.map((entry, i) => (
        <EntryForm
          key={entry.id}
          entry={entry}
          index={i}
          onChange={(e) => updateEntry(i, e)}
          onRemove={() => removeEntry(i)}
        />
      ))}
      <button
        type="button"
        onClick={addEntry}
        className="rounded-lg border border-dashed border-zinc-300 px-4 py-3 text-sm text-zinc-500 hover:bg-zinc-50 transition"
      >
        + Add experience
      </button>
    </div>
  );
}
