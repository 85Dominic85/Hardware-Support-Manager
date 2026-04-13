"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useFilterParams } from "@/hooks/use-filter-params";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import { ViewToggle } from "@/components/shared/view-toggle";
import { SearchBar } from "@/components/shared/search-bar";
import { FilterBar } from "@/components/shared/filter-bar";
import { RmaList } from "./rma-list";
import { RmaKanban } from "./rma-kanban";
import { fetchRmas } from "@/server/actions/rmas";
import { RMA_FILTERS } from "@/lib/constants/filter-options";
import type { PaginatedResult, SortOrder } from "@/types";
import type { RmaRow } from "@/server/queries/rmas";

interface RmaPageContentProps {
  initialData: PaginatedResult<RmaRow>;
  defaultPageSize?: number;
}

export function RmaPageContent({ initialData, defaultPageSize }: RmaPageContentProps) {
  const [view, setView] = useState<"table" | "canvas">("table");
  const { inputValue, setInputValue, debouncedValue: search } = useDebouncedSearch();
  const { params: filterParams, filterValues, filterKey, setFilter, clearFilters, activeFilterCount } =
    useFilterParams(RMA_FILTERS);

  // Kanban fetches all items respecting current search & filters
  const { data: kanbanData } = useQuery({
    queryKey: ["rmas-kanban", { search, filters: filterValues }],
    queryFn: () =>
      fetchRmas({
        page: 1,
        pageSize: 200,
        search: search || undefined,
        sortBy: "stateChangedAt",
        sortOrder: "asc" as SortOrder,
        filters: filterValues,
      }),
    enabled: view === "canvas",
  });

  const searchAndFilters = (
    <div className="space-y-3">
      <SearchBar
        value={inputValue}
        onChange={setInputValue}
        placeholder="Buscar RMA..."
      />
      <FilterBar
        filters={RMA_FILTERS}
        params={filterParams}
        onFilterChange={setFilter}
        onClearFilters={clearFilters}
        activeFilterCount={activeFilterCount}
      />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ViewToggle view={view} onViewChange={setView} altLabel="Kanban" />
      </div>
      {view === "table" ? (
        <RmaList
          initialData={initialData}
          defaultPageSize={defaultPageSize}
          search={search}
          filterValues={filterValues}
          filterKey={filterKey}
          searchAndFilters={searchAndFilters}
        />
      ) : (
        <div className="space-y-4">
          {searchAndFilters}
          <RmaKanban data={kanbanData?.data ?? initialData.data} />
        </div>
      )}
    </div>
  );
}
