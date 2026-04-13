"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTableSearchParams } from "@/hooks/use-table-search-params";
import { DataTable } from "@/components/shared/data-table";
import { incidentColumns, INCIDENT_MOBILE_HIDDEN_COLUMNS } from "./incident-columns";
import { useIsMobile } from "@/hooks/use-mobile";
import { fetchIncidents } from "@/server/actions/incidents";
import type { PaginatedResult } from "@/types";
import type { IncidentRow } from "@/server/queries/incidents";
import type { SortOrder } from "@/types";

interface IncidentListProps {
  initialData: PaginatedResult<IncidentRow>;
  defaultPageSize?: number;
  search: string;
  filterValues: Record<string, string | string[] | undefined>;
  filterKey: string;
  searchAndFilters: React.ReactNode;
}

export function IncidentList({
  initialData,
  defaultPageSize,
  search,
  filterValues,
  filterKey,
  searchAndFilters,
}: IncidentListProps) {
  const isMobile = useIsMobile();
  const { page, pageSize, sortBy, sortOrder, setPage, setPageSize, setSorting } =
    useTableSearchParams("stateChangedAt", defaultPageSize);

  // Reset page to 1 when search or filters change
  useEffect(() => { setPage(1); }, [search, filterKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const { data: queryData, isLoading } = useQuery({
    queryKey: ["incidents", { page, pageSize, search, sortBy, sortOrder, filters: filterValues }],
    queryFn: () =>
      fetchIncidents({
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
      columns={incidentColumns}
      columnVisibility={isMobile ? INCIDENT_MOBILE_HIDDEN_COLUMNS : undefined}
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
