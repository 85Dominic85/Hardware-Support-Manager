/**
 * Text normalization helpers for the global search bar.
 *
 * Both the user's typed query AND the database column values must be put
 * through the same normalization (case-folded, accent-stripped) so a query
 * like "cafe" matches "Café" stored in the DB.
 *
 * On the JS side this uses NFD decomposition + combining-mark removal,
 * which is supported natively by `String.prototype.normalize`. On the SQL
 * side we use `lower(translate(...))` (see `sql-search.ts`) because the
 * Supabase pooler does not support the `unaccent` extension.
 */

// Combining Diacritical Marks block (U+0300 .. U+036F). Built via
// String.fromCharCode so the source file stays free of invisible
// combining chars that would be impossible to spot.
const DIACRITICS_RE = new RegExp(
  `[${String.fromCharCode(0x0300)}-${String.fromCharCode(0x036f)}]`,
  "g",
);

/** Lowercase + strip diacritics (accents). Does NOT remove punctuation. */
export function normalizeSearchInput(input: string): string {
  return input.toLowerCase().normalize("NFD").replace(DIACRITICS_RE, "");
}

/**
 * Split a normalized query into search tokens.
 *
 * Separators: whitespace, comma, semicolon, period, colon, exclamation,
 * question, parentheses, brackets, braces, slash, backslash, pipe,
 * underscore. The hyphen `-` is preserved inside tokens so device codes
 * like "JWS-360" survive.
 *
 * Rules:
 *   - Discards tokens with fewer than 2 characters
 *   - Deduplicates tokens
 *   - Returns at most 5 tokens (defensive against very long queries)
 */
export function tokenizeSearchInput(input: string): string[] {
  const normalized = normalizeSearchInput(input);
  const rawTokens = normalized
    .split(/[\s,;.:!?()[\]{}/\\|_]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);

  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of rawTokens) {
    if (seen.has(t)) continue;
    seen.add(t);
    out.push(t);
    if (out.length >= 5) break;
  }
  return out;
}
