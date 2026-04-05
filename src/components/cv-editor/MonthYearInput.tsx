"use client";

interface Props {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
}

export function MonthYearInput({ id, value, onChange, disabled, error }: Props) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let raw = e.target.value.replace(/\D/g, "");
    if (raw.length > 6) raw = raw.slice(0, 6);

    let formatted = raw;
    if (raw.length > 2) {
      formatted = raw.slice(0, 2) + "/" + raw.slice(2);
    }
    onChange(formatted);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && value.endsWith("/")) {
      e.preventDefault();
      onChange(value.slice(0, -1));
    }
  }

  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      placeholder="MM/YYYY"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      maxLength={7}
      className={`rounded-md border px-3 py-2 text-sm w-full transition disabled:bg-gray-50 ${
        error
          ? "border-red-400 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300"
          : "border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900"
      }`}
    />
  );
}
