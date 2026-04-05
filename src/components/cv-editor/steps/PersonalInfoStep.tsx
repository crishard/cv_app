"use client";

import { PersonalInfo } from "@/types/cv";

interface Props {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
  error: string | null;
}

function Field({
  label,
  id,
  type = "text",
  required,
  value,
  onChange,
}: {
  label: string;
  id: keyof PersonalInfo;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (field: keyof PersonalInfo, value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        className="rounded-md border px-3 py-2 text-sm"
      />
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
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
      <Field label="Full Name" id="fullName" required value={data.fullName} onChange={handleChange} />
      <Field label="Email" id="email" type="email" required value={data.email} onChange={handleChange} />
      <Field label="Phone" id="phone" required value={data.phone} onChange={handleChange} />
      <Field label="Location" id="location" required value={data.location} onChange={handleChange} />
      <Field label="LinkedIn" id="linkedin" value={data.linkedin ?? ""} onChange={handleChange} />
      <Field label="GitHub" id="github" value={data.github ?? ""} onChange={handleChange} />
      <Field label="Portfolio" id="portfolio" value={data.portfolio ?? ""} onChange={handleChange} />
      <div className="flex flex-col gap-1">
        <label htmlFor="summary" className="text-sm font-medium">Summary</label>
        <textarea
          id="summary"
          name="summary"
          rows={4}
          value={data.summary}
          onChange={(e) => handleChange("summary", e.target.value)}
          className="rounded-md border px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
}
