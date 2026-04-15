"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useFilterParams } from "@/hooks/use-filter-params";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import { ViewToggle } from "@/components/shared/view-toggle";
import { SearchBar } from "@/components/shared/search-bar";
import { FilterBar } from "@/components/shared/filter-bar";
import { IncidentList } from "./incident-list";
import { IncidentKanban } from "./incident-kanban";
import { fetchIncidents } from "@/server/actions/incidents";
import { buildIncidentFilters, type FilterOption } from "@/lib/constants/filter-options";
import type { PaginatedResult, SortOrder } from "@/types";
import type { IncidentRow } from "@/server/queries/incidents";

interface IncidentPageContentProps {
  initialData: PaginatedResult<IncidentRow>;
  defaultPageSize?: number;
  userOptions?: FilterOption[];
}

export function IncidentPageContent({ initialData, defaultPageSize, userOptions }: IncidentPageContentProps) {
  const [view, setView] = useState<"table" | "canvas">("table");

  // Search: pure in-memory debounce. Lives in this component, shared with table + kanban.
  const { inputValue, setInputValue, debouncedValue: search } = useDebouncedSearch();

  // Filters: URL state via nuqs (shallow: true, no SSR navigation)
  const filterConfigs = useMemo(() => buildIncidentFilters(userOptions), [userOptions]);
  const { params: filterParams, filterValues, filterKey, setFilter, clearFilters, activeFilterCount } =
    useFilterParams(filterConfigs);

  // Kanban: fetches all items respecting current search & filters
  const { data: kanbanData, isError: kanbanError } = useQuery({
    queryKey: ["incidents-canvas", { search, filters: filterValues }],
    queryFn: () =>
      fetchIncidents({
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
        placeholder="Buscar incidencia..."
      />
      <FilterBar
        filters={filterConfigs}
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
        <IncidentList
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
          {kanbanError ? (
            <div className="rounded-lg border p-8 text-center text-muted-foreground">
              <p className="font-medium text-foreground">Error al cargar el kanban</p>
              <p className="text-sm">Comprueba tu conexión e inténtalo de nuevo.</p>
            </div>
          ) : (
            <IncidentKanban data={kanbanData?.data ?? initialData.data} />
          )}
        </div>
      )}
    </div>
  );
}
