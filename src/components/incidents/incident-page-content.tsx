"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTableSearchParams } from "@/hooks/use-table-search-params";
import { ViewToggle } from "@/components/shared/view-toggle";
import { IncidentList } from "./incident-list";
import { IncidentCanvas } from "./incident-canvas";
import { fetchIncidents } from "@/server/actions/incidents";
import type { PaginatedResult, SortOrder } from "@/types";
import type { IncidentRow } from "@/server/queries/incidents";

interface IncidentPageContentProps {
  initialData: PaginatedResult<IncidentRow>;
}

export function IncidentPageContent({ initialData }: IncidentPageContentProps) {
  const [view, setView] = useState<"table" | "canvas">("table");
  const { search } = useTableSearchParams("createdAt");

  // For canvas, fetch all (no pagination)
  const { data: canvasData } = useQuery({
    queryKey: ["incidents-canvas", search],
    queryFn: () =>
      fetchIncidents({ page: 1, pageSize: 200, search, sortBy: "stateChangedAt", sortOrder: "asc" as SortOrder }),
    enabled: view === "canvas",
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ViewToggle view={view} onViewChange={setView} />
      </div>
      {view === "table" ? (
        <IncidentList initialData={initialData} />
      ) : (
        <IncidentCanvas data={canvasData?.data ?? initialData.data} />
      )}
    </div>
  );
}
