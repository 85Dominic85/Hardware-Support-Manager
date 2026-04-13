"use client";

import { useCallback } from "react";
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";

/**
 * URL state for table pagination and sorting.
 * Uses shallow: true — no SSR navigation. TanStack Query handles all data fetching.
 */
export function useTableSearchParams(defaultSortBy = "createdAt", defaultPageSize = 10) {
  const [params, setParams] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      pageSize: parseAsInteger.withDefault(defaultPageSize),
      sortBy: parseAsString.withDefault(defaultSortBy),
      sortOrder: parseAsString.withDefault("desc"),
    },
    { shallow: true }
  );

  const setPage = useCallback(
    (page: number) => setParams({ page }),
    [setParams]
  );

  const setPageSize = useCallback(
    (pageSize: number) => setParams({ pageSize, page: 1 }),
    [setParams]
  );

  const setSorting = useCallback(
    (sortBy: string, sortOrder: "asc" | "desc") => setParams({ sortBy, sortOrder, page: 1 }),
    [setParams]
  );

  return { ...params, setPage, setPageSize, setSorting };
}
