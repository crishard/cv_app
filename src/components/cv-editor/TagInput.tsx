"use client";

import { useState, useRef } from "react";

interface Props {
  id: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function TagInput({ id, values, onChange, placeholder = "Type and press Enter..." }: Props) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function add(raw: string) {
    const tag = raw.trim();
    if (tag && !values.includes(tag)) {
      onChange([...values, tag]);
    }
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(input);
    }
    if (e.key === "Backspace" && input === "" && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  }

  function handleBlur() {
    if (input.trim()) add(input);
  }

  function remove(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex min-h-[42px] flex-wrap gap-1.5 rounded-md border border-zinc-300 px-3 py-2 cursor-text focus-within:border-zinc-900 focus-within:ring-2 focus-within:ring-zinc-900/10 transition"
    >
      {values.map((tag, i) => (
        <span
          key={i}
          className="flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-sm text-zinc-700"
        >
          {tag}
          <button
            type="button"
            onClick={() => remove(i)}
            className="text-zinc-400 hover:text-zinc-700 leading-none"
            aria-label={`Remove ${tag}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        id={id}
        value={input}
        onChange={(e) => setInput(e.target.value.replace(",", ""))}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={values.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[120px] border-none outline-none bg-transparent text-sm placeholder:text-zinc-400"
      />
    </div>
  );
}
