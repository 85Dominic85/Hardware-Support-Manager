"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchClients, deleteClient } from "@/server/actions/clients";
import { getClientColumns } from "@/components/clients/client-columns";
import { DataTable } from "@/components/shared/data-table";
import { SearchBar } from "@/components/shared/search-bar";
import { FilterBar } from "@/components/shared/filter-bar";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { useTableSearchParams } from "@/hooks/use-table-search-params";
import { useFilterParams } from "@/hooks/use-filter-params";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import { CLIENT_FILTERS } from "@/lib/constants/filter-options";
import type { PaginatedResult, SortOrder } from "@/types";
import type { ClientRow } from "@/server/queries/clients";

interface ClientListProps {
  initialData: PaginatedResult<ClientRow>;
  defaultPageSize?: number;
}

export function ClientList({ initialData, defaultPageSize }: ClientListProps) {
  const queryClient = useQueryClient();
  const { page, pageSize, sortBy, sortOrder, setSorting, setPage, setPageSize } =
    useTableSearchParams("createdAt", defaultPageSize);
  const { inputValue, setInputValue, debouncedValue: search } = useDebouncedSearch();
  const { params: filterParams, filterValues, setFilter, clearFilters, activeFilterCount } =
    useFilterParams(CLIENT_FILTERS);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: queryData, isLoading } = useQuery({
    queryKey: ["clients", { page, pageSize, search, sortBy, sortOrder, filters: filterValues }],
    queryFn: () =>
      fetchClients({
        page,
        pageSize,
        search,
        sortBy,
        sortOrder: sortOrder as SortOrder,
        filters: filterValues,
      }),
    staleTime: 0,
  });

  const data = queryData ?? initialData;

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Cliente eliminado correctamente");
        queryClient.invalidateQueries({ queryKey: ["clients"] });
      } else {
        toast.error(result.error);
      }
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Error al eliminar el cliente");
      setDeleteId(null);
    },
  });

  const columns = useMemo(
    () =>
      getClientColumns({
        onDelete: (id) => setDeleteId(id),
        sortBy,
        sortOrder: sortOrder as "asc" | "desc",
        onSort: setSorting,
      }),
    [sortBy, sortOrder, setSorting]
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={data.data}
        totalCount={data.totalCount}
        page={data.page}
        pageSize={data.pageSize}
        totalPages={data.totalPages}
        isLoading={isLoading}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        searchBar={
          <div className="space-y-3">
            <SearchBar
              value={inputValue}
              onChange={setInputValue}
              placeholder="Buscar clientes..."
            />
            <FilterBar
              filters={CLIENT_FILTERS}
              params={filterParams}
              onFilterChange={setFilter}
              onClearFilters={clearFilters}
              activeFilterCount={activeFilterCount}
            />
          </div>
        }
      />

      <ConfirmDeleteDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        title="Eliminar cliente"
        description="Esta accion no se puede deshacer. El cliente sera eliminado permanentemente."
        onConfirm={() => {
          if (deleteId) deleteMutation.mutate(deleteId);
        }}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
