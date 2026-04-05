import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { checkRateLimit } from "./rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("allows requests under the limit", () => {
    for (let i = 0; i < 20; i++) {
      expect(checkRateLimit("user-1")).toBe(true);
    }
  });

  it("blocks the 21st request within the same window", () => {
    for (let i = 0; i < 20; i++) checkRateLimit("user-2");
    expect(checkRateLimit("user-2")).toBe(false);
  });

  it("resets after the window expires", () => {
    for (let i = 0; i < 20; i++) checkRateLimit("user-3");
    expect(checkRateLimit("user-3")).toBe(false);

    vi.advanceTimersByTime(60_001);

    expect(checkRateLimit("user-3")).toBe(true);
  });

  it("tracks users independently", () => {
    for (let i = 0; i < 20; i++) checkRateLimit("user-a");
    expect(checkRateLimit("user-a")).toBe(false);
    expect(checkRateLimit("user-b")).toBe(true);
  });
});
