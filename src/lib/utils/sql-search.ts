import { sql, type SQL, type AnyColumn } from "drizzle-orm";

/**
 * SQL fragment for accent + case insensitive ILIKE.
 *
 * Postgres' `unaccent()` extension is not available via the Supabase pooler
 * (see CLAUDE.md / fix commit `8ff3bc3`), so we emulate it with `translate()`
 * — a built-in that maps each source character to a destination character
 * 1:1. Combined with `lower()`, this yields case + diacritic insensitive
 * lookup without any extension.
 *
 * Mapping covers Spanish/Catalan/Portuguese accents and uppercase variants.
 *
 * Caller must pass an already-normalized `term` (lowercase, no diacritics);
 * use `normalizeSearchInput` from search-normalize.ts before calling.
 */
const FROM_CHARS = "áéíóúüñÁÉÍÓÚÜÑàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛäëïöÄËÏÖãõÃÕçÇ";
const TO_CHARS   = "aeiouunAEIOUUNaeiouAEIOUaeiouAEIOUaeioAEIOaoAOcC";

export function accentInsensitiveLike(
  column: AnyColumn | SQL,
  normalizedTerm: string,
): SQL {
  const pattern = `%${normalizedTerm}%`;
  return sql`lower(translate(${column}, ${FROM_CHARS}, ${TO_CHARS})) ILIKE ${pattern}`;
}
