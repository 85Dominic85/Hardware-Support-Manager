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

export function useFilterParams(filters: FilterConfig[]) {
  // Stabilize parsers by filter structure (keys+types) rather than array reference.
  // Without this, a new `filters` array reference (e.g. from SSR props) would cause
  // useQueryStates to re-subscribe on every render, leading to infinite loops.
  const filtersKey = useMemo(
    () => filters.map(f => `${f.key}:${f.type}`).join(","),
    [filters]
  );
  const parsers = useMemo(
    () => buildParsers(filters),
    [filtersKey] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // shallow: true — only update URL without triggering a full server-side
  // page reload. React Query handles refetching with the new filter values.
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
        if (Array.isArray(val) && val.length > 0 && !val.every(v => v === "")) count++;
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
      if (Array.isArray(val) && (val.length === 0 || val.every(v => v === ""))) continue;
      result[key] = val as string | string[];
    }
    return result;
  }, [params, parsers]);

  // Stable string key for use as useEffect dependency — prevents infinite
  // loops caused by filterValues being a new object reference each render
  const filterKey = useMemo(() => JSON.stringify(filterValues), [filterValues]);

  return {
    params,
    filterValues,
    filterKey,
    setFilter,
    clearFilters,
    activeFilterCount,
  };
}
