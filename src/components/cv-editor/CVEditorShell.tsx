"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { CVEditorWizard } from "./CVEditorWizard";
import { CVData, TemplateId } from "@/types/cv";

interface Props {
  cvId: string;
  initialTitle: string;
  initialData: CVData;
  templateId: TemplateId;
  onSave: (data: CVData) => Promise<void>;
  cvText: string;
}

function EditableTitle({ cvId, initialTitle, onTitleChange }: {
  cvId: string;
  initialTitle: string;
  onTitleChange: (title: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(initialTitle);
  }, [initialTitle]);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  async function save() {
    const trimmed = value.trim() || "Untitled CV";
    setValue(trimmed);
    setEditing(false);
    if (trimmed === initialTitle) return;
    onTitleChange(trimmed);
    await fetch(`/api/cv/${cvId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: trimmed }),
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") save();
    if (e.key === "Escape") { setValue(initialTitle); setEditing(false); }
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={handleKeyDown}
        className="rounded border border-zinc-300 px-2 py-0.5 text-sm font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 w-48 text-center"
        maxLength={80}
      />
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      title="Click to rename"
      className="group flex items-center gap-1.5 font-semibold text-zinc-900 hover:text-zinc-600 transition"
    >
      {value}
      <svg className="h-3.5 w-3.5 text-zinc-400 opacity-0 group-hover:opacity-100 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z" />
      </svg>
    </button>
  );
}

const DEFAULT_TITLES = new Set(["Untitled CV", "untitled cv"]);

export function CVEditorShell({ cvId, initialTitle, initialData, templateId, onSave, cvText }: Props) {
  const [title, setTitle] = useState(initialTitle);
  const autoUpdated = useRef(false);

  async function handleDataChange(data: CVData) {
    await onSave(data);

    const firstName = data.personalInfo.fullName.trim().split(" ")[0];
    if (
      firstName &&
      !autoUpdated.current &&
      (DEFAULT_TITLES.has(title.toLowerCase()) || DEFAULT_TITLES.has(initialTitle.toLowerCase()))
    ) {
      autoUpdated.current = true;
      const newTitle = `${firstName}'s CV`;
      setTitle(newTitle);
      await fetch(`/api/cv/${cvId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b px-6 py-3 bg-white">
        <Link href="/dashboard" className="text-sm text-zinc-500 hover:underline">
          ← Dashboard
        </Link>
        <EditableTitle
          cvId={cvId}
          initialTitle={title}
          onTitleChange={setTitle}
        />
        <Link
          href={`/cv/${cvId}/preview`}
          className="rounded-md bg-zinc-900 px-4 py-1.5 text-sm text-white hover:bg-zinc-700 transition"
        >
          Preview & Export
        </Link>
      </header>

      <div className="flex flex-1 gap-0">
        <main className="flex-1 overflow-y-auto p-8 bg-zinc-50">
          <CVEditorWizard
            cvId={cvId}
            templateId={templateId}
            initialData={initialData}
            onSave={handleDataChange}
          />
        </main>

        <aside className="w-80 shrink-0 border-l p-6 bg-white">
          <ATSScorePanelWrapper cvText={cvText} />
        </aside>
      </div>
    </div>
  );
}

// Lazy import to avoid SSR issues
function ATSScorePanelWrapper({ cvText }: { cvText: string }) {
  const [Panel, setPanel] = useState<React.ComponentType<{ cvText: string }> | null>(null);

  useEffect(() => {
    import("@/components/cv-editor/ai-assistant/ATSScorePanel").then((m) => {
      setPanel(() => m.ATSScorePanel);
    });
  }, []);

  if (!Panel) return <div className="text-sm text-zinc-400">Loading...</div>;
  return <Panel cvText={cvText} />;
}
