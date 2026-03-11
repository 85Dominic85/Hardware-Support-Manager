"use client";

import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DataTable } from "@/components/shared/data-table";
import { SearchBar } from "@/components/shared/search-bar";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { getClientColumns } from "@/components/clients/client-columns";
import { useTableSearchParams } from "@/hooks/use-table-search-params";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import { fetchClients, deleteClient } from "@/server/actions/clients";
import type { ClientRow } from "@/server/queries/clients";
import type { PaginatedResult, SortOrder } from "@/types";

interface ClientListProps {
  initialData: PaginatedResult<ClientRow>;
}

export function ClientList({ initialData }: ClientListProps) {
  const queryClient = useQueryClient();
  const { page, pageSize, sortBy, sortOrder, setSorting, setPage } =
    useTableSearchParams("createdAt");
  const { inputValue, setInputValue, debouncedValue: search } = useDebouncedSearch();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: queryData, isLoading } = useQuery({
    queryKey: ["clients", { page, pageSize, search, sortBy, sortOrder }],
    queryFn: () =>
      fetchClients({
        page,
        pageSize,
        search: search || undefined,
        sortBy,
        sortOrder: sortOrder as SortOrder,
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

  const handleDelete = useCallback((id: string) => {
    setDeleteId(id);
  }, []);

  const handleSort = useCallback(
    (newSortBy: string, newSortOrder: SortOrder) => {
      setSorting(newSortBy, newSortOrder);
    },
    [setSorting]
  );

  const columns = useMemo(
    () =>
      getClientColumns({
        onDelete: handleDelete,
        sortBy,
        sortOrder: sortOrder as SortOrder,
        onSort: handleSort,
      }),
    [handleDelete, sortBy, sortOrder, handleSort]
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
        searchBar={
          <SearchBar
            value={inputValue}
            onChange={setInputValue}
            placeholder="Buscar clientes por nombre, email o empresa..."
          />
        }
      />

      <ConfirmDeleteDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        title="Eliminar cliente"
        description="¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer."
        onConfirm={() => {
          if (deleteId) {
            deleteMutation.mutate(deleteId);
          }
        }}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
