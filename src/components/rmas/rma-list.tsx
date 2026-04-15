"use client";

import { useRef } from "react";
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

  // Auto-reset page to 1 when search or filters change.
  // Done via ref comparison during render — no useEffect, no URL writes, no loops.
  const prevSearchRef = useRef(search);
  const prevFilterKeyRef = useRef(filterKey);
  let effectivePage = page;
  if (search !== prevSearchRef.current || filterKey !== prevFilterKeyRef.current) {
    effectivePage = 1;
    prevSearchRef.current = search;
    prevFilterKeyRef.current = filterKey;
  }

  const { data: queryData, isLoading } = useQuery({
    queryKey: ["rmas", { page: effectivePage, pageSize, search, sortBy, sortOrder, filters: filterValues }],
    queryFn: () =>
      fetchRmas({
        page: effectivePage,
        pageSize,
        search: search || undefined,
        sortBy,
        sortOrder: sortOrder as SortOrder,
        filters: filterValues,
      }),
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
