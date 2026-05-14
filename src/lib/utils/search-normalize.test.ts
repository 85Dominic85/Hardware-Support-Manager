import { describe, it, expect } from "vitest";
import { normalizeSearchInput, tokenizeSearchInput } from "./search-normalize";

describe("normalizeSearchInput", () => {
  it("lowercases", () => {
    expect(normalizeSearchInput("CAFE")).toBe("cafe");
  });

  it("strips accents (é → e)", () => {
    expect(normalizeSearchInput("Café")).toBe("cafe");
  });

  it("strips multiple accents", () => {
    expect(normalizeSearchInput("Cantína")).toBe("cantina");
    expect(normalizeSearchInput("Habitación")).toBe("habitacion");
    expect(normalizeSearchInput("Ñoño")).toBe("nono");
  });

  it("preserves punctuation (separate concern: tokenizer handles it)", () => {
    expect(normalizeSearchInput("Café, Cantina!")).toBe("cafe, cantina!");
  });

  it("handles empty string", () => {
    expect(normalizeSearchInput("")).toBe("");
  });
});

describe("tokenizeSearchInput", () => {
  it("splits on whitespace", () => {
    expect(tokenizeSearchInput("cafe cantina")).toEqual(["cafe", "cantina"]);
  });

  it("splits on comma + space", () => {
    expect(tokenizeSearchInput("cafe, cantina")).toEqual(["cafe", "cantina"]);
  });

  it("splits on multiple punctuation chars", () => {
    expect(tokenizeSearchInput("cafe; cantina! restaurante.")).toEqual([
      "cafe",
      "cantina",
      "restaurante",
    ]);
  });

  it("normalizes accents before tokenizing", () => {
    expect(tokenizeSearchInput("Café, Cantína")).toEqual(["cafe", "cantina"]);
  });

  it("preserves hyphens inside tokens (e.g. JWS-360)", () => {
    expect(tokenizeSearchInput("JWS-360 impresora")).toEqual([
      "jws-360",
      "impresora",
    ]);
  });

  it("discards single-character tokens", () => {
    expect(tokenizeSearchInput("a cafe b")).toEqual(["cafe"]);
  });

  it("deduplicates repeated tokens", () => {
    expect(tokenizeSearchInput("cafe cafe cantina")).toEqual([
      "cafe",
      "cantina",
    ]);
  });

  it("caps at 5 tokens", () => {
    expect(
      tokenizeSearchInput("uno dos tres cuatro cinco seis siete"),
    ).toEqual(["uno", "dos", "tres", "cuatro", "cinco"]);
  });

  it("returns empty array for whitespace-only input", () => {
    expect(tokenizeSearchInput("   ")).toEqual([]);
  });

  it("returns empty array for punctuation-only input", () => {
    expect(tokenizeSearchInput("!?.,;")).toEqual([]);
  });

  it("returns empty array for empty input", () => {
    expect(tokenizeSearchInput("")).toEqual([]);
  });
});
