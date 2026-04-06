"use client";

import { useState } from "react";
import { CVData, TemplateId, EMPTY_CV_DATA } from "@/types/cv";
import { PersonalInfoStep } from "./steps/PersonalInfoStep";
import { ExperienceStep } from "./steps/ExperienceStep";
import { EducationStep } from "./steps/EducationStep";
import { SkillsStep } from "./steps/SkillsStep";
import { ReviewStep } from "./steps/ReviewStep";
import { useAutosave } from "@/hooks/useAutosave";

const STEP_LABELS = [
  "Personal Info",
  "Experience",
  "Education",
  "Skills",
  "Review",
];

import { isFuture, isStartAfterEnd } from "@/lib/date-utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateStep(step: number, data: CVData): string | null {
  if (step === 0) {
    const { fullName, email, phone, location } = data.personalInfo;
    if (!fullName || !email || !phone || !location) {
      return "Please fill in all required fields before continuing.";
    }
    if (!EMAIL_RE.test(email)) {
      return "Please enter a valid email address.";
    }
  }
  if (step === 1) {
    const incomplete = data.experience.some((e) => !e.position || !e.company);
    if (incomplete) return "Each experience entry requires a position and company.";
    const futureStart = data.experience.some((e) => isFuture(e.startDate));
    if (futureStart) return "Experience start date cannot be in the future.";
    const badOrder = data.experience.some((e) => !e.current && isStartAfterEnd(e.startDate, e.endDate));
    if (badOrder) return "Experience start date must be before the end date.";
  }
  if (step === 2) {
    const incomplete = data.education.some((e) => !e.institution || !e.degree);
    if (incomplete) return "Each education entry requires an institution and degree.";
    const futureStart = data.education.some((e) => isFuture(e.startDate));
    if (futureStart) return "Education start date cannot be in the future.";
    const badOrder = data.education.some((e) => isStartAfterEnd(e.startDate, e.endDate));
    if (badOrder) return "Education start date must be before the end date.";
  }
  return null;
}

interface Props {
  cvId: string;
  templateId: TemplateId;
  initialData: CVData;
  onSave: (data: CVData) => Promise<void>;
}

export function CVEditorWizard({ cvId, templateId, initialData, onSave }: Props) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<CVData>(initialData ?? EMPTY_CV_DATA);
  const [error, setError] = useState<string | null>(null);

  const autosaveStatus = useAutosave({ cvId, data, onSave });

  function handleNext() {
    const validationError = validateStep(step, data);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setStep((s) => s + 1);
  }

  function handleBack() {
    setError(null);
    setStep((s) => s - 1);
  }

  return (
    <div className="flex flex-col gap-6">
      <ol className="flex items-center gap-2" aria-label="Editor steps">
        {STEP_LABELS.map((label, i) => (
          <li
            key={label}
            className={`flex-1 rounded-full py-1 text-center text-xs font-medium ${
              i === step
                ? "bg-blue-600 text-white"
                : i < step
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {label}
          </li>
        ))}
      </ol>

      <div>
        {step === 0 && (
          <PersonalInfoStep
            data={data.personalInfo}
            onChange={(personalInfo) => setData({ ...data, personalInfo })}
            error={error}
          />
        )}
        {step === 1 && (
          <ExperienceStep
            data={data.experience}
            onChange={(experience) => setData({ ...data, experience })}
          />
        )}
        {step === 2 && (
          <EducationStep
            data={data.education}
            onChange={(education) => setData({ ...data, education })}
          />
        )}
        {step === 3 && (
          <SkillsStep
            data={data.skills}
            onChange={(skills) => setData({ ...data, skills })}
          />
        )}
        {step === 4 && <ReviewStep data={data} templateId={templateId} />}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        {autosaveStatus === "pending" && <span>Unsaved changes</span>}
        {autosaveStatus === "saving" && <span>Saving...</span>}
        {autosaveStatus === "saved" && <span className="text-green-600">Saved</span>}
        {autosaveStatus === "error" && <span className="text-red-500">Save failed</span>}
        {autosaveStatus === "idle" && <span />}
      </div>

      <div className="flex justify-between">
        {step > 0 ? (
          <button
            type="button"
            onClick={handleBack}
            className="rounded-md border px-4 py-2 text-sm"
          >
            Back
          </button>
        ) : (
          <span />
        )}
        {step < STEP_LABELS.length - 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="rounded-md bg-black px-4 py-2 text-sm text-white"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
