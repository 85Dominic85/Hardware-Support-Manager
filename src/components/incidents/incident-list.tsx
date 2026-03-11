"use client";

import { useQuery } from "@tanstack/react-query";
import { useTableSearchParams } from "@/hooks/use-table-search-params";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import { DataTable } from "@/components/shared/data-table";
import { SearchBar } from "@/components/shared/search-bar";
import { incidentColumns } from "./incident-columns";
import { fetchIncidents } from "@/server/actions/incidents";
import type { PaginatedResult } from "@/types";
import type { IncidentRow } from "@/server/queries/incidents";
import type { SortOrder } from "@/types";

interface IncidentListProps {
  initialData: PaginatedResult<IncidentRow>;
}

export function IncidentList({ initialData }: IncidentListProps) {
  const { page, pageSize, sortBy, sortOrder, setPage } =
    useTableSearchParams("createdAt");
  const { inputValue, setInputValue, debouncedValue: search } = useDebouncedSearch();

  const { data: queryData, isLoading } = useQuery({
    queryKey: ["incidents", { page, pageSize, search, sortBy, sortOrder }],
    queryFn: () =>
      fetchIncidents({ page, pageSize, search: search || undefined, sortBy, sortOrder: sortOrder as SortOrder }),
    staleTime: 0,
  });

  const data = queryData ?? initialData;

  return (
    <DataTable
      columns={incidentColumns}
      data={data.data}
      totalCount={data.totalCount}
      page={data.page}
      pageSize={data.pageSize}
      totalPages={data.totalPages}
      isLoading={isLoading}
      onPageChange={setPage}
      searchBar={
        <SearchBar
          value={inputValue}
          onChange={setInputValue}
          placeholder="Buscar incidencia..."
        />
      }
    />
  );
}
