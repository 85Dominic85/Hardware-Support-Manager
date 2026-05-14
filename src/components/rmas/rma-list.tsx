"use client";

import { useMemo, useRef } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useTableSearchParams } from "@/hooks/use-table-search-params";
import { DataTable } from "@/components/shared/data-table";
import { rmaColumns, RMA_MOBILE_HIDDEN_COLUMNS } from "./rma-columns";
import { useIsMobile } from "@/hooks/use-mobile";
import { fetchRmas } from "@/server/actions/rmas";
import {
  OPEN_RMA_STATUSES,
  CLOSED_RMA_STATUSES,
} from "@/lib/constants/statuses";
import type { PaginatedResult } from "@/types";
import type { RmaRow } from "@/server/queries/rmas";
import type { SortOrder } from "@/types";

interface RmaListProps {
  initialData: PaginatedResult<RmaRow>;
  defaultPageSize?: number;
  search: string;
  filterValues: Record<string, string | string[] | undefined>;
  filterKey: string;
  searchAndFilters?: React.ReactNode;
  /**
   * Pre-applied status filter. `"open"` = active workflow, `"closed"` =
   * recibido_oficina / cerrado / cancelado. Default sort changes accordingly.
   */
  variant?: "open" | "closed";
  /** URL param prefix when two tables coexist (e.g. "open" → ?open_page=2). */
  paramPrefix?: string;
}

export function RmaList({
  initialData,
  defaultPageSize,
  search,
  filterValues,
  filterKey,
  searchAndFilters,
  variant,
  paramPrefix,
}: RmaListProps) {
  const isMobile = useIsMobile();

  // For RMAs, "newest entries first" in Activas → createdAt DESC.
  // Cerradas → stateChangedAt DESC (when each one moved into final state).
  const defaultSortBy =
    variant === "closed" ? "stateChangedAt" :
    variant === "open" ? "createdAt" :
    "stateChangedAt";

  const { page, pageSize, sortBy, sortOrder, setPage, setPageSize, setSorting } =
    useTableSearchParams(defaultSortBy, defaultPageSize, paramPrefix);

  const effectiveFilters = useMemo(() => {
    if (!variant) return filterValues;

    const lifecycleStatuses =
      variant === "open"
        ? (OPEN_RMA_STATUSES as readonly string[])
        : (CLOSED_RMA_STATUSES as readonly string[]);

    const userStatus = filterValues.status;
    let statusFilter: string[];

    if (Array.isArray(userStatus) && userStatus.length > 0) {
      statusFilter = userStatus.filter((s) => lifecycleStatuses.includes(s));
      if (statusFilter.length === 0) statusFilter = [...lifecycleStatuses];
    } else {
      statusFilter = [...lifecycleStatuses];
    }

    return { ...filterValues, status: statusFilter };
  }, [filterValues, variant]);

  const prevSearchRef = useRef(search);
  const prevFilterKeyRef = useRef(filterKey);
  let effectivePage = page;
  if (search !== prevSearchRef.current || filterKey !== prevFilterKeyRef.current) {
    effectivePage = 1;
    prevSearchRef.current = search;
    prevFilterKeyRef.current = filterKey;
  }

  const queryKeyPrefix = variant ? `rmas-${variant}` : "rmas";

  const { data: queryData, isLoading, isError, error, refetch } = useQuery({
    queryKey: [queryKeyPrefix, { page: effectivePage, pageSize, search, sortBy, sortOrder, filters: effectiveFilters }],
    queryFn: () =>
      fetchRmas({
        page: effectivePage,
        pageSize,
        search: search || undefined,
        sortBy,
        sortOrder: sortOrder as SortOrder,
        filters: effectiveFilters,
      }),
    placeholderData: keepPreviousData,
  });

  const data = queryData ?? initialData;

  return (
    <DataTable
      columns={rmaColumns}
      columnVisibility={isMobile ? RMA_MOBILE_HIDDEN_COLUMNS : undefined}
      data={data.data}
      totalCount={data.totalCount}
      page={data.page}
      pageSize={data.pageSize}
      totalPages={data.totalPages}
      isLoading={isLoading && !queryData}
      isError={isError}
      errorMessage={error?.message}
      onRetry={() => refetch()}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={setSorting}
      searchBar={searchAndFilters}
    />
  );
}
