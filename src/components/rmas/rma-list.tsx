"use client";

import { useQuery } from "@tanstack/react-query";
import { useTableSearchParams } from "@/hooks/use-table-search-params";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import { DataTable } from "@/components/shared/data-table";
import { SearchBar } from "@/components/shared/search-bar";
import { rmaColumns } from "./rma-columns";
import { fetchRmas } from "@/server/actions/rmas";
import type { PaginatedResult } from "@/types";
import type { RmaRow } from "@/server/queries/rmas";
import type { SortOrder } from "@/types";

interface RmaListProps {
  initialData: PaginatedResult<RmaRow>;
}

export function RmaList({ initialData }: RmaListProps) {
  const { page, pageSize, sortBy, sortOrder, setPage } =
    useTableSearchParams("createdAt");
  const { inputValue, setInputValue, debouncedValue: search } = useDebouncedSearch();

  const { data: queryData, isLoading } = useQuery({
    queryKey: ["rmas", { page, pageSize, search, sortBy, sortOrder }],
    queryFn: () =>
      fetchRmas({ page, pageSize, search: search || undefined, sortBy, sortOrder: sortOrder as SortOrder }),
    staleTime: 0,
  });

  const data = queryData ?? initialData;

  return (
    <DataTable
      columns={rmaColumns}
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
          placeholder="Buscar RMA..."
        />
      }
    />
  );
}
