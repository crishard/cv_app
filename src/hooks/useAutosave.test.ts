import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAutosave } from "./useAutosave";
import { EMPTY_CV_DATA } from "@/types/cv";

describe("useAutosave", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not call onSave immediately on mount", () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    renderHook(() => useAutosave({ cvId: "cv-1", data: EMPTY_CV_DATA, onSave }));
    expect(onSave).not.toHaveBeenCalled();
  });

  it("calls onSave after 30 seconds when data changes", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const { rerender } = renderHook(
      ({ data }) => useAutosave({ cvId: "cv-1", data, onSave }),
      { initialProps: { data: EMPTY_CV_DATA } }
    );

    const updatedData = {
      ...EMPTY_CV_DATA,
      personalInfo: { ...EMPTY_CV_DATA.personalInfo, fullName: "Jane" },
    };

    rerender({ data: updatedData });

    expect(onSave).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(30000);
    });

    expect(onSave).toHaveBeenCalledWith(updatedData);
  });

  it("resets the timer when data changes before 30 seconds elapse", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const { rerender } = renderHook(
      ({ data }) => useAutosave({ cvId: "cv-1", data, onSave }),
      { initialProps: { data: EMPTY_CV_DATA } }
    );

    rerender({ data: { ...EMPTY_CV_DATA, personalInfo: { ...EMPTY_CV_DATA.personalInfo, fullName: "J" } } });
    await act(async () => { vi.advanceTimersByTime(15000); });

    rerender({ data: { ...EMPTY_CV_DATA, personalInfo: { ...EMPTY_CV_DATA.personalInfo, fullName: "Jane" } } });
    await act(async () => { vi.advanceTimersByTime(15000); });

    expect(onSave).not.toHaveBeenCalled();

    await act(async () => { vi.advanceTimersByTime(15000); });
    expect(onSave).toHaveBeenCalledTimes(1);
  });
});
