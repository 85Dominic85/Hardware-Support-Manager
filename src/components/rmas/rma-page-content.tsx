"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useFilterParams } from "@/hooks/use-filter-params";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import { ViewToggle } from "@/components/shared/view-toggle";
import { SearchBar } from "@/components/shared/search-bar";
import { FilterBar } from "@/components/shared/filter-bar";
import { RmaList } from "./rma-list";
import { RmaKanban } from "./rma-kanban";
import { fetchRmas } from "@/server/actions/rmas";
import { buildRmaFilters, type FilterOption } from "@/lib/constants/filter-options";
import type { PaginatedResult, SortOrder } from "@/types";
import type { RmaRow } from "@/server/queries/rmas";

interface RmaPageContentProps {
  openInitialData: PaginatedResult<RmaRow>;
  closedInitialData: PaginatedResult<RmaRow>;
  defaultPageSize?: number;
  providerOptions?: FilterOption[];
}

export function RmaPageContent({
  openInitialData,
  closedInitialData,
  defaultPageSize,
  providerOptions,
}: RmaPageContentProps) {
  const [view, setView] = useState<"table" | "canvas">("table");

  // Search: pure in-memory debounce. Lives in this component, shared with table + kanban.
  const { inputValue, setInputValue, debouncedValue: search } = useDebouncedSearch();

  // In table view we exclude the Estado filter because Activas/Cerradas
  // already split the data by lifecycle.
  const filterConfigs = useMemo(
    () => buildRmaFilters(providerOptions, { excludeStatus: view === "table" }),
    [providerOptions, view],
  );
  const { params: filterParams, filterValues, filterKey, setFilter, clearFilters, activeFilterCount } =
    useFilterParams(filterConfigs);

  // Kanban: fetches all items respecting current search & filters
  const { data: kanbanData, isError: kanbanError } = useQuery({
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
        <div className="space-y-6">
          {searchAndFilters}

          {/* Activos — RMAs en curso */}
          <section className="space-y-2">
            <header className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                Activos
              </h2>
              <span className="text-xs text-muted-foreground">
                En curso — más recientes primero
              </span>
            </header>
            <RmaList
              initialData={openInitialData}
              defaultPageSize={defaultPageSize}
              search={search}
              filterValues={filterValues}
              filterKey={filterKey}
              variant="open"
              paramPrefix="open"
            />
          </section>

          {/* Divider visible entre las dos secciones */}
          <div className="relative py-2" aria-hidden="true">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                Histórico
              </span>
            </div>
          </div>

          {/* Cerrados — recibido_oficina / cerrado / cancelado */}
          <section className="space-y-2">
            <header className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Cerrados
              </h2>
              <span className="text-xs text-muted-foreground">
                Recibido oficina / Cerrado / Cancelado
              </span>
            </header>
            <RmaList
              initialData={closedInitialData}
              defaultPageSize={10}
              search={search}
              filterValues={filterValues}
              filterKey={filterKey}
              variant="closed"
              paramPrefix="closed"
            />
          </section>
        </div>
      ) : (
        <div className="space-y-4">
          {searchAndFilters}
          {kanbanError ? (
            <div className="rounded-lg border p-8 text-center text-muted-foreground">
              <p className="font-medium text-foreground">Error al cargar el kanban</p>
              <p className="text-sm">Comprueba tu conexión e inténtalo de nuevo.</p>
            </div>
          ) : (
            <RmaKanban data={kanbanData?.data ?? openInitialData.data} />
          )}
        </div>
      )}
    </div>
  );
}
