import { describe, it, expect } from "vitest";
import { formatDate, formatDateTime, formatRelativeTime } from "./date-format";

describe("formatDate", () => {
  it("returns '-' for null/undefined", () => {
    expect(formatDate(null)).toBe("-");
    expect(formatDate(undefined)).toBe("-");
  });

  it("formats a Date object", () => {
    const date = new Date("2026-03-05T10:30:00Z");
    const result = formatDate(date);
    expect(result).toMatch(/05\/03\/2026/);
  });

  it("formats a date string", () => {
    const result = formatDate("2026-01-15T00:00:00Z");
    expect(result).toMatch(/15\/01\/2026/);
  });
});

describe("formatDateTime", () => {
  it("returns '-' for null/undefined", () => {
    expect(formatDateTime(null)).toBe("-");
    expect(formatDateTime(undefined)).toBe("-");
  });

  it("formats date and time", () => {
    const date = new Date("2026-03-05T10:30:00Z");
    const result = formatDateTime(date);
    expect(result).toContain("05/03/2026");
  });
});

describe("formatRelativeTime", () => {
  it("returns '-' for null/undefined", () => {
    expect(formatRelativeTime(null)).toBe("-");
  });

  it("returns 'hace unos segundos' for very recent dates", () => {
    const now = new Date();
    expect(formatRelativeTime(now)).toBe("hace unos segundos");
  });

  it("returns minutes for dates within the last hour", () => {
    const date = new Date(Date.now() - 30 * 60 * 1000);
    expect(formatRelativeTime(date)).toBe("hace 30 minutos");
  });

  it("returns hours for dates within the last day", () => {
    const date = new Date(Date.now() - 5 * 60 * 60 * 1000);
    expect(formatRelativeTime(date)).toBe("hace 5 horas");
  });

  it("returns days for dates older than 24 hours", () => {
    const date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(date)).toBe("hace 3 días");
  });

  it("uses singular form for 1 unit", () => {
    const date = new Date(Date.now() - 1 * 60 * 60 * 1000);
    expect(formatRelativeTime(date)).toBe("hace 1 hora");
  });
});
