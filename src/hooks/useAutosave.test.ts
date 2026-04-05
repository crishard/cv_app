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

  it("calls onSave after 3 seconds when data changes", async () => {
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
      vi.advanceTimersByTime(3000);
    });

    expect(onSave).toHaveBeenCalledWith(updatedData);
  });

  it("resets the timer when data changes before 3 seconds elapse", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const { rerender } = renderHook(
      ({ data }) => useAutosave({ cvId: "cv-1", data, onSave }),
      { initialProps: { data: EMPTY_CV_DATA } }
    );

    // First change — starts 3s timer
    rerender({ data: { ...EMPTY_CV_DATA, personalInfo: { ...EMPTY_CV_DATA.personalInfo, fullName: "J" } } });
    await act(async () => { vi.advanceTimersByTime(1000); }); // 1s in — timer not fired yet

    // Second change before timer fires — resets to a new 3s timer
    rerender({ data: { ...EMPTY_CV_DATA, personalInfo: { ...EMPTY_CV_DATA.personalInfo, fullName: "Jane" } } });
    await act(async () => { vi.advanceTimersByTime(1000); }); // another 1s — still not fired

    expect(onSave).not.toHaveBeenCalled();

    // Now let the full 3s pass from the second change
    await act(async () => { vi.advanceTimersByTime(3000); });
    expect(onSave).toHaveBeenCalledTimes(1);
  });
});
