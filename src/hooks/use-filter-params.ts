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
  const parsers = useMemo(() => buildParsers(filters), [filters]);

  const [params, setParams] = useQueryStates(parsers, { shallow: false });

  const setFilter = useCallback(
    (key: string, value: string | string[] | null) => {
      setParams({ [key]: value === null ? "" : value });
    },
    [setParams]
  );

  const clearFilters = useCallback(() => {
    const reset: Record<string, string | string[]> = {};
    for (const key of Object.keys(parsers)) {
      reset[key] = "";
    }
    setParams(reset);
  }, [parsers, setParams]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    for (const f of filters) {
      if (f.type === "multi-select") {
        const val = params[f.key];
        if (Array.isArray(val) && val.length > 0) count++;
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
      if (Array.isArray(val) && val.length === 0) continue;
      result[key] = val as string | string[];
    }
    return result;
  }, [params, parsers]);

  return {
    params,
    filterValues,
    setFilter,
    clearFilters,
    activeFilterCount,
  };
}
