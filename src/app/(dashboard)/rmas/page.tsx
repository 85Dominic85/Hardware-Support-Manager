import type { Metadata } from "next";
import Link from "next/link";
import { RotateCcw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRmas } from "@/server/queries/rmas";
import { getDefaultPageSize } from "@/server/queries/settings";
import { getProviderFilterOptions } from "@/server/queries/filter-options";
import { RmaPageContent } from "@/components/rmas/rma-page-content";
import type { SortOrder } from "@/types";

export const metadata: Metadata = {
  title: "RMAs",
};

export default async function RmasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const defaultPageSize = await getDefaultPageSize().catch(() => 20);
  const page = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) || defaultPageSize;
  const search = typeof params.search === "string" && params.search ? params.search : undefined;
  const sortBy = typeof params.sortBy === "string" ? params.sortBy : "stateChangedAt";
  const sortOrder = (typeof params.sortOrder === "string" ? params.sortOrder : "desc") as SortOrder;

  // Extract filter params from URL for SSR — ensures initial render respects active filters.
  // nuqs parseAsArrayOf serializes arrays as comma-separated single params (e.g. ?status=nuevo,en_triaje),
  // so we must split on comma when the value is a plain string.
  const toArray = (v: string | string[] | undefined): string[] | undefined => {
    if (!v) return undefined;
    if (Array.isArray(v)) return v;
    return v.includes(",") ? v.split(",") : [v];
  };
  const filters: Record<string, string | string[] | undefined> = {};
  if (params.status) filters.status = toArray(params.status);
  if (params.providerId) filters.providerId = toArray(params.providerId);
  if (typeof params.dateRangeFrom === "string") filters.dateRangeFrom = params.dateRangeFrom;
  if (typeof params.dateRangeTo === "string") filters.dateRangeTo = params.dateRangeTo;

  const [providerOptions, initialData] = await Promise.all([
    getProviderFilterOptions().catch(() => []),
    getRmas({
      page,
      pageSize,
      search,
      sortBy,
      sortOrder,
      ...(Object.keys(filters).length > 0 ? { filters } : {}),
    }).catch(() => ({ data: [], totalCount: 0, page, pageSize, totalPages: 0 })),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
            <RotateCcw className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">RMAs</h1>
            <p className="text-sm text-muted-foreground">
              Autorizaciones de devolución de mercancía
            </p>
          </div>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/rmas/new">
            <Plus className="h-4 w-4 mr-1" />
            Nuevo RMA
          </Link>
        </Button>
      </div>
      <RmaPageContent initialData={initialData} defaultPageSize={defaultPageSize} providerOptions={providerOptions} />
    </div>
  );
}
