"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ViewToggle } from "@/components/shared/view-toggle";
import { RmaList } from "./rma-list";
import { RmaKanban } from "./rma-kanban";
import { fetchRmas } from "@/server/actions/rmas";
import type { PaginatedResult, SortOrder } from "@/types";
import type { RmaRow } from "@/server/queries/rmas";

interface RmaPageContentProps {
  initialData: PaginatedResult<RmaRow>;
}

export function RmaPageContent({ initialData }: RmaPageContentProps) {
  const [view, setView] = useState<"table" | "canvas">("table");

  // For kanban, fetch all (no pagination)
  const { data: kanbanData } = useQuery({
    queryKey: ["rmas-kanban"],
    queryFn: () =>
      fetchRmas({ page: 1, pageSize: 200, sortBy: "stateChangedAt", sortOrder: "asc" as SortOrder }),
    enabled: view === "canvas",
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ViewToggle view={view} onViewChange={setView} altLabel="Kanban" />
      </div>
      {view === "table" ? (
        <RmaList initialData={initialData} />
      ) : (
        <RmaKanban data={kanbanData?.data ?? initialData.data} />
      )}
    </div>
  );
}
