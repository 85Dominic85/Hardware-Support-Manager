"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTableSearchParams } from "@/hooks/use-table-search-params";
import { DataTable } from "@/components/shared/data-table";
import { rmaColumns, RMA_MOBILE_HIDDEN_COLUMNS } from "./rma-columns";
import { useIsMobile } from "@/hooks/use-mobile";
import { fetchRmas } from "@/server/actions/rmas";
import type { PaginatedResult } from "@/types";
import type { RmaRow } from "@/server/queries/rmas";
import type { SortOrder } from "@/types";

interface RmaListProps {
  initialData: PaginatedResult<RmaRow>;
  defaultPageSize?: number;
  search: string;
  filterValues: Record<string, string | string[] | undefined>;
  filterKey: string;
  searchAndFilters: React.ReactNode;
}

export function RmaList({
  initialData,
  defaultPageSize,
  search,
  filterValues,
  filterKey,
  searchAndFilters,
}: RmaListProps) {
  const isMobile = useIsMobile();
  const { page, pageSize, sortBy, sortOrder, setPage, setPageSize, setSorting } =
    useTableSearchParams("stateChangedAt", defaultPageSize);

  // Reset page to 1 when search or filters actually change (not on mount).
  // Uses refs to track previous values and a guard to avoid firing setPage(1)
  // when page is already 1 — prevents infinite re-render loops with nuqs URL state.
  const prevSearchRef = useRef(search);
  const prevFilterKeyRef = useRef(filterKey);

  useEffect(() => {
    const searchChanged = search !== prevSearchRef.current;
    const filterChanged = filterKey !== prevFilterKeyRef.current;
    prevSearchRef.current = search;
    prevFilterKeyRef.current = filterKey;

    if ((searchChanged || filterChanged) && page !== 1) {
      setPage(1);
    }
  }, [search, filterKey, page, setPage]);

  const { data: queryData, isLoading } = useQuery({
    queryKey: ["rmas", { page, pageSize, search, sortBy, sortOrder, filters: filterValues }],
    queryFn: () =>
      fetchRmas({
        page,
        pageSize,
        search: search || undefined,
        sortBy,
        sortOrder: sortOrder as SortOrder,
        filters: filterValues,
      }),
    staleTime: 0,
    refetchInterval: 30_000,
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
      isLoading={isLoading}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={setSorting}
      searchBar={searchAndFilters}
    />
  );
}
