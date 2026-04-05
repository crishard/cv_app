import { useEffect, useRef } from "react";
import { CVData } from "@/types/cv";

const AUTOSAVE_DELAY = 30_000;

interface Props {
  cvId: string;
  data: CVData;
  onSave: (data: CVData) => Promise<void>;
}

export function useAutosave({ data, onSave }: Props) {
  const isFirstRender = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      onSave(data);
    }, AUTOSAVE_DELAY);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [data, onSave]);
}
