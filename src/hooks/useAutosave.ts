import { useEffect, useRef, useState } from "react";
import { CVData } from "@/types/cv";

const AUTOSAVE_DELAY = 30_000;

export type AutosaveStatus = "idle" | "pending" | "saving" | "saved" | "error";

interface Props {
  cvId: string;
  data: CVData;
  onSave: (data: CVData) => Promise<void>;
}

export function useAutosave({ data, onSave }: Props) {
  const isFirstRender = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [status, setStatus] = useState<AutosaveStatus>("idle");

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setStatus("pending");
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      setStatus("saving");
      try {
        await onSave(data);
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2000);
      } catch {
        setStatus("error");
      }
    }, AUTOSAVE_DELAY);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [data, onSave]);

  return status;
}
