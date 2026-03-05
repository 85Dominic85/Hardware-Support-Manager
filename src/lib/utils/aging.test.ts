import { describe, it, expect, vi, afterEach } from "vitest";
import { calculateAging } from "./aging";

describe("calculateAging", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns zero values for null/undefined", () => {
    const result = calculateAging(null);
    expect(result).toEqual({ days: 0, hours: 0, minutes: 0, label: "-", isOverdue: false });
  });

  it("calculates minutes correctly", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-05T10:45:00Z"));

    const result = calculateAging("2026-03-05T10:00:00Z");
    expect(result.minutes).toBe(45);
    expect(result.hours).toBe(0);
    expect(result.days).toBe(0);
    expect(result.label).toBe("45m");
    expect(result.isOverdue).toBe(false);
  });

  it("calculates hours and minutes correctly", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-05T15:30:00Z"));

    const result = calculateAging("2026-03-05T10:00:00Z");
    expect(result.hours).toBe(5);
    expect(result.minutes).toBe(30);
    expect(result.days).toBe(0);
    expect(result.label).toBe("5h 30m");
  });

  it("calculates days correctly", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-08T14:00:00Z"));

    const result = calculateAging("2026-03-05T10:00:00Z");
    expect(result.days).toBe(3);
    expect(result.label).toContain("3d");
  });

  it("marks as overdue when exceeding threshold", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-10T10:00:00Z"));

    const result = calculateAging("2026-03-05T10:00:00Z", 3);
    expect(result.isOverdue).toBe(true);
  });

  it("is not overdue when within threshold", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-06T10:00:00Z"));

    const result = calculateAging("2026-03-05T10:00:00Z", 3);
    expect(result.isOverdue).toBe(false);
  });

  it("accepts Date objects", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-05T11:00:00Z"));

    const result = calculateAging(new Date("2026-03-05T10:00:00Z"));
    expect(result.hours).toBe(1);
  });
});
