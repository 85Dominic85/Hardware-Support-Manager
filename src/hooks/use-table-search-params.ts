"use client";

import { useCallback, useRef } from "react";
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";

export function useTableSearchParams(defaultSortBy: string = "createdAt") {
  const [params, setParams] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      pageSize: parseAsInteger.withDefault(10),
      search: parseAsString.withDefault(""),
      sortBy: parseAsString.withDefault(defaultSortBy),
      sortOrder: parseAsString.withDefault("desc"),
    },
    { shallow: false }
  );

  // Use ref to guarantee stable callbacks regardless of setParams stability
  const setParamsRef = useRef(setParams);
  setParamsRef.current = setParams;

  const setSearch = useCallback(
    (value: string) => setParamsRef.current({ search: value, page: 1 }),
    []
  );

  const setSorting = useCallback(
    (sortBy: string, sortOrder: "asc" | "desc") =>
      setParamsRef.current({ sortBy, sortOrder, page: 1 }),
    []
  );

  const setPage = useCallback(
    (page: number) => setParamsRef.current({ page }),
    []
  );

  const setPageSize = useCallback(
    (pageSize: number) => setParamsRef.current({ pageSize, page: 1 }),
    []
  );

  return {
    ...params,
    setSearch,
    setSorting,
    setPage,
    setPageSize,
  };
}
