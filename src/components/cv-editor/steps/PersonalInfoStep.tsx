"use client";

import { PersonalInfo } from "@/types/cv";

interface Props {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
  error: string | null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d\s\-().]{7,20}$/;

const inputBase =
  "rounded-md border px-3 py-2 text-sm w-full transition focus:outline-none focus:ring-2";
const inputNormal = `${inputBase} border-zinc-300 focus:ring-zinc-900/10 focus:border-zinc-900`;
const inputError = `${inputBase} border-red-400 bg-red-50 focus:ring-red-300`;

function Field({
  label,
  id,
  type = "text",
  required,
  value,
  validate,
  onChange,
  placeholder,
}: {
  label: string;
  id: keyof PersonalInfo;
  type?: string;
  required?: boolean;
  value: string;
  validate?: (v: string) => boolean;
  onChange: (field: keyof PersonalInfo, value: string) => void;
  placeholder?: string;
}) {
  const invalid = required && value.length > 0 && validate ? !validate(value) : false;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-zinc-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(id, e.target.value)}
        className={invalid ? inputError : inputNormal}
      />
      {invalid && (
        <span className="text-xs text-red-500">
          {id === "email" ? "Enter a valid email address" : "Enter a valid phone number"}
        </span>
      )}
    </div>
  );
}

export function PersonalInfoStep({ data, onChange, error }: Props) {
  function handleChange(field: keyof PersonalInfo, value: string) {
    onChange({ ...data, [field]: value });
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Personal Info</h2>
      {error && (
        <p role="alert" className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full Name" id="fullName" required value={data.fullName} onChange={handleChange} placeholder="John Doe" />
        <Field label="Email" id="email" type="email" required value={data.email} validate={(v) => EMAIL_RE.test(v)} onChange={handleChange} placeholder="you@example.com" />
        <Field label="Phone" id="phone" required value={data.phone} validate={(v) => PHONE_RE.test(v)} onChange={handleChange} placeholder="+1 (555) 000-0000" />
        <Field label="Location" id="location" required value={data.location} onChange={handleChange} placeholder="City, Country" />
        <Field label="LinkedIn" id="linkedin" value={data.linkedin ?? ""} onChange={handleChange} placeholder="linkedin.com/in/yourname" />
        <Field label="GitHub" id="github" value={data.github ?? ""} onChange={handleChange} placeholder="github.com/yourname" />
        <Field label="Portfolio" id="portfolio" value={data.portfolio ?? ""} onChange={handleChange} placeholder="yoursite.com" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="summary" className="text-sm font-medium text-zinc-700">Summary</label>
        <textarea
          id="summary"
          name="summary"
          rows={4}
          value={data.summary}
          placeholder="Brief professional summary highlighting your key skills and experience..."
          onChange={(e) => handleChange("summary", e.target.value)}
          className={inputNormal}
        />
      </div>
    </div>
  );
}
