"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { INCIDENT_PRIORITY_LABELS, type IncidentPriority } from "@/lib/constants/incidents";
import { RMA_STATUS_LABELS, type RmaStatus } from "@/lib/constants/rmas";
import type { DrilldownIncident, DrilldownRma } from "@/server/actions/dashboard-drilldown";

const PRIORITY_COLORS: Record<string, string> = {
  critica: "bg-red-500/15 text-red-700 dark:text-red-400 border-0",
  alta: "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-0",
  media: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-0",
  baja: "bg-slate-500/15 text-slate-700 dark:text-slate-400 border-0",
};

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) return `${diffDays}d`;
  return `${Math.floor(diffDays / 7)}sem`;
}

export function DrilldownSkeleton() {
  return (
    <div className="space-y-2 py-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-2 py-1.5 opacity-0 animate-[fadeInUp_250ms_ease-out_forwards]"
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-5 w-12" />
        </div>
      ))}
    </div>
  );
}

interface IncidentDrilldownProps {
  items: DrilldownIncident[];
}

export function IncidentDrilldown({ items }: IncidentDrilldownProps) {
  if (items.length === 0) {
    return (
      <p className="py-3 text-center text-sm text-muted-foreground">
        Sin incidencias en este rango
      </p>
    );
  }

  return (
    <div className="space-y-0.5 py-1">
      {items.map((item, i) => (
        <Link
          key={item.id}
          href={`/incidents/${item.id}`}
          className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors duration-150 hover:bg-muted/50 group opacity-0 animate-[fadeInUp_250ms_ease-out_forwards]"
          style={{
            animationDelay: `${i * 40}ms`,
            animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <span className="shrink-0 font-mono text-xs font-medium text-primary">
            {item.incidentNumber}
          </span>
          <span className="min-w-0 flex-1 truncate text-muted-foreground">
            {item.title}
          </span>
          <Badge
            className={cn(
              "shrink-0 text-xs px-1.5 py-0",
              PRIORITY_COLORS[item.priority] ?? "bg-muted"
            )}
          >
            {INCIDENT_PRIORITY_LABELS[item.priority as IncidentPriority] ?? item.priority}
          </Badge>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatRelativeDate(item.createdAt)}
          </span>
          <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/50 transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      ))}
    </div>
  );
}

interface RmaDrilldownProps {
  items: DrilldownRma[];
}

export function RmaDrilldown({ items }: RmaDrilldownProps) {
  if (items.length === 0) {
    return (
      <p className="py-3 text-center text-sm text-muted-foreground">
        Sin RMAs en este rango
      </p>
    );
  }

  return (
    <div className="space-y-0.5 py-1">
      {items.map((item, i) => (
        <Link
          key={item.id}
          href={`/rmas/${item.id}`}
          className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors duration-150 hover:bg-muted/50 group opacity-0 animate-[fadeInUp_250ms_ease-out_forwards]"
          style={{
            animationDelay: `${i * 40}ms`,
            animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <span className="shrink-0 font-mono text-xs font-medium text-primary">
            {item.rmaNumber}
          </span>
          <span className="min-w-0 flex-1 truncate text-muted-foreground">
            {[item.deviceBrand, item.deviceModel].filter(Boolean).join(" ") || item.providerName || "—"}
          </span>
          <Badge className="shrink-0 text-xs px-1.5 py-0 bg-muted text-muted-foreground border-0">
            {RMA_STATUS_LABELS[item.status as RmaStatus] ?? item.status}
          </Badge>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatRelativeDate(item.createdAt)}
          </span>
          <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/50 transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      ))}
    </div>
  );
}
