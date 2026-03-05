"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTableSearchParams } from "@/hooks/use-table-search-params";
import { ViewToggle } from "@/components/shared/view-toggle";
import { RmaList } from "./rma-list";
import { RmaCanvas } from "./rma-canvas";
import { fetchRmas } from "@/server/actions/rmas";
import type { PaginatedResult, SortOrder } from "@/types";
import type { RmaRow } from "@/server/queries/rmas";

interface RmaPageContentProps {
  initialData: PaginatedResult<RmaRow>;
}

export function RmaPageContent({ initialData }: RmaPageContentProps) {
  const [view, setView] = useState<"table" | "canvas">("table");
  const { search } = useTableSearchParams("createdAt");

  // For canvas, fetch all (no pagination)
  const { data: canvasData } = useQuery({
    queryKey: ["rmas-canvas", search],
    queryFn: () =>
      fetchRmas({ page: 1, pageSize: 200, search, sortBy: "stateChangedAt", sortOrder: "asc" as SortOrder }),
    enabled: view === "canvas",
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ViewToggle view={view} onViewChange={setView} />
      </div>
      {view === "table" ? (
        <RmaList initialData={initialData} />
      ) : (
        <RmaCanvas data={canvasData?.data ?? initialData.data} />
      )}
    </div>
  );
}
