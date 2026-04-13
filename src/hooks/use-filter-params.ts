"use client";

import { useCallback, useMemo } from "react";
import { useQueryStates, parseAsString, parseAsArrayOf } from "nuqs";
import type { FilterConfig } from "@/lib/constants/filter-options";

/* eslint-disable @typescript-eslint/no-explicit-any */
function buildParsers(filters: FilterConfig[]): Record<string, any> {
  const p: Record<string, any> = {};
  for (const f of filters) {
    if (f.type === "multi-select") {
      p[f.key] = parseAsArrayOf(parseAsString).withDefault([]);
    } else if (f.type === "date-range") {
      p[`${f.key}From`] = parseAsString.withDefault("");
      p[`${f.key}To`] = parseAsString.withDefault("");
    } else {
      p[f.key] = parseAsString.withDefault("");
    }
  }
  return p;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * URL state for table filters.
 * Uses shallow: true — no SSR navigation. TanStack Query handles refetching.
 * Parsers are stabilized by filter structure (keys+types) to prevent
 * useQueryStates from re-subscribing on every render.
 */
export function useFilterParams(filters: FilterConfig[]) {
  // Stabilize parsers by structure, not by array reference identity
  const structureKey = useMemo(
    () => filters.map((f) => `${f.key}:${f.type}`).join(","),
    [filters]
  );
  const parsers = useMemo(
    () => buildParsers(filters),
    [structureKey] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const [params, setParams] = useQueryStates(parsers, { shallow: true });

  const setFilter = useCallback(
    (key: string, value: string | string[] | null) => {
      setParams({ [key]: value ?? null });
    },
    [setParams]
  );

  const clearFilters = useCallback(() => {
    const reset: Record<string, string | string[] | null> = {};
    for (const key of Object.keys(parsers)) {
      reset[key] = null;
    }
    setParams(reset);
  }, [parsers, setParams]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    for (const f of filters) {
      if (f.type === "multi-select") {
        const val = params[f.key];
        if (Array.isArray(val) && val.length > 0 && !val.every((v) => v === "")) count++;
      } else if (f.type === "date-range") {
        if (params[`${f.key}From`] || params[`${f.key}To`]) count++;
      } else {
        if (params[f.key]) count++;
      }
    }
    return count;
  }, [params, filters]);

  const filterValues = useMemo(() => {
    const result: Record<string, string | string[] | undefined> = {};
    for (const key of Object.keys(parsers)) {
      const val = params[key];
      if (val === null || val === undefined || val === "") continue;
      if (Array.isArray(val) && (val.length === 0 || val.every((v) => v === ""))) continue;
      result[key] = val as string | string[];
    }
    return result;
  }, [params, parsers]);

  const filterKey = useMemo(() => JSON.stringify(filterValues), [filterValues]);

  return { params, filterValues, filterKey, setFilter, clearFilters, activeFilterCount };
}
