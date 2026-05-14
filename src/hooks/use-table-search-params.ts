"use client";

import { useCallback, useMemo } from "react";
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";

/**
 * URL state for table pagination and sorting.
 * Uses shallow: true — no SSR navigation. TanStack Query handles all data fetching.
 *
 * If `paramPrefix` is provided, query param keys are prefixed so multiple
 * tables can live on the same page without colliding. Example:
 *   useTableSearchParams("createdAt", 20, "open")
 *   → URL keys: open_page, open_pageSize, open_sortBy, open_sortOrder
 *
 * Without prefix it falls back to the original keys (`page`, `pageSize`,
 * `sortBy`, `sortOrder`) so existing callers keep working unchanged.
 */
export function useTableSearchParams(
  defaultSortBy = "createdAt",
  defaultPageSize = 10,
  paramPrefix?: string,
) {
  const keys = useMemo(() => {
    const p = paramPrefix ? `${paramPrefix}_` : "";
    return {
      page: `${p}page`,
      pageSize: `${p}pageSize`,
      sortBy: `${p}sortBy`,
      sortOrder: `${p}sortOrder`,
    };
  }, [paramPrefix]);

  const [rawParams, setRawParams] = useQueryStates(
    {
      [keys.page]: parseAsInteger.withDefault(1),
      [keys.pageSize]: parseAsInteger.withDefault(defaultPageSize),
      [keys.sortBy]: parseAsString.withDefault(defaultSortBy),
      [keys.sortOrder]: parseAsString.withDefault("desc"),
    },
    { shallow: true },
  );

  const params = useMemo(
    () => ({
      page: rawParams[keys.page] as number,
      pageSize: rawParams[keys.pageSize] as number,
      sortBy: rawParams[keys.sortBy] as string,
      sortOrder: rawParams[keys.sortOrder] as string,
    }),
    [rawParams, keys],
  );

  const setPage = useCallback(
    (page: number) => setRawParams({ [keys.page]: page }),
    [setRawParams, keys.page],
  );

  const setPageSize = useCallback(
    (pageSize: number) =>
      setRawParams({ [keys.pageSize]: pageSize, [keys.page]: 1 }),
    [setRawParams, keys.pageSize, keys.page],
  );

  const setSorting = useCallback(
    (sortBy: string, sortOrder: "asc" | "desc") =>
      setRawParams({
        [keys.sortBy]: sortBy,
        [keys.sortOrder]: sortOrder,
        [keys.page]: 1,
      }),
    [setRawParams, keys.sortBy, keys.sortOrder, keys.page],
  );

  return { ...params, setPage, setPageSize, setSorting };
}
