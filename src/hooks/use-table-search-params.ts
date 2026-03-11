"use client";

import { useCallback } from "react";
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";

export function useTableSearchParams(defaultSortBy: string = "createdAt") {
  const [params, setParams] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      pageSize: parseAsInteger.withDefault(10),
      sortBy: parseAsString.withDefault(defaultSortBy),
      sortOrder: parseAsString.withDefault("desc"),
    },
    { shallow: false }
  );

  const setSorting = useCallback(
    (sortBy: string, sortOrder: "asc" | "desc") => setParams({ sortBy, sortOrder, page: 1 }),
    [setParams]
  );

  const setPage = useCallback(
    (page: number) => setParams({ page }),
    [setParams]
  );

  const setPageSize = useCallback(
    (pageSize: number) => setParams({ pageSize, page: 1 }),
    [setParams]
  );

  return {
    ...params,
    setSorting,
    setPage,
    setPageSize,
  };
}
