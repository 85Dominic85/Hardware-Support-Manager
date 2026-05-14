"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { User } from "lucide-react";
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
  openInitialData: PaginatedResult<IncidentRow>;
  closedInitialData: PaginatedResult<IncidentRow>;
  defaultPageSize?: number;
  userOptions?: FilterOption[];
}

export function IncidentPageContent({
  openInitialData,
  closedInitialData,
  defaultPageSize,
  userOptions,
}: IncidentPageContentProps) {
  const [view, setView] = useState<"table" | "canvas">("table");

  // Search: pure in-memory debounce. Lives in this component, shared with table + kanban.
  const { inputValue, setInputValue, debouncedValue: search } = useDebouncedSearch();

  // Filters: URL state via nuqs (shallow: true, no SSR navigation).
  // In table view we exclude the Estado filter because the Activas/Cerradas
  // split already covers it.
  const filterConfigs = useMemo(
    () => buildIncidentFilters(userOptions, { excludeStatus: view === "table" }),
    [userOptions, view],
  );
  const { params: filterParams, filterValues, filterKey, setFilter, clearFilters, activeFilterCount } =
    useFilterParams(filterConfigs);

  // "Solo mías" toggle: filters to incidents assigned to the current user.
  // Active when assignedUserId filter contains ONLY the current user's id.
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const assignedFilter = filterValues.assignedUserId;
  const onlyMineActive =
    !!currentUserId &&
    Array.isArray(assignedFilter) &&
    assignedFilter.length === 1 &&
    assignedFilter[0] === currentUserId;

  const toggleOnlyMine = () => {
    if (!currentUserId) return;
    setFilter("assignedUserId", onlyMineActive ? null : [currentUserId]);
  };

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
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <SearchBar
          value={inputValue}
          onChange={setInputValue}
          placeholder="Buscar incidencia..."
        />
        {currentUserId && (
          <button
            type="button"
            onClick={toggleOnlyMine}
            aria-pressed={onlyMineActive}
            className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
              onlyMineActive
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:bg-muted/60"
            }`}
            title={onlyMineActive ? "Mostrando solo tus incidencias" : "Filtrar solo las asignadas a ti"}
          >
            <User className="h-3.5 w-3.5" />
            Solo mías
          </button>
        )}
      </div>
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

          {/* Activas — incidencias abiertas, sort por createdAt DESC */}
          <section className="space-y-2">
            <header className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                Activas
              </h2>
              <span className="text-xs text-muted-foreground">
                Sin resolver — nuevas primero
              </span>
            </header>
            <IncidentList
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

          {/* Cerradas — resueltas / cerradas / canceladas */}
          <section className="space-y-2">
            <header className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Cerradas
              </h2>
              <span className="text-xs text-muted-foreground">
                Resuelto / Cerrado / Cancelado — recientes primero
              </span>
            </header>
            <IncidentList
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
            <IncidentKanban
              data={kanbanData?.data ?? openInitialData.data}
            />
          )}
        </div>
      )}
    </div>
  );
}
