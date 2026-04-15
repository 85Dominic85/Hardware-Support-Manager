import type { QueryClient } from "@tanstack/react-query";

/**
 * Centralized query keys and cache invalidation helpers.
 * All components must use these instead of hardcoding query key strings.
 */
export const queryKeys = {
  incidents: {
    all: ["incidents"] as const,
    canvas: () => ["incidents-canvas"] as const,
  },
  rmas: {
    all: ["rmas"] as const,
    canvas: () => ["rmas-canvas"] as const,
  },
  alerts: ["alert-badges"] as const,
  linkedRmas: (incidentId: string) => ["linked-rmas", incidentId] as const,
  eventLogs: (entityType: string, entityId: string) =>
    ["event-logs", entityType, entityId] as const,
  dashboard: {
    stats: (range?: unknown) => ["dashboard-stats", range] as const,
    all: ["dashboard"] as const,
  },
} as const;

/** Invalidate all incident-related queries (list, kanban, badges). */
export function invalidateIncidentQueries(qc: QueryClient) {
  qc.invalidateQueries({ queryKey: queryKeys.incidents.all });
  qc.invalidateQueries({ queryKey: queryKeys.incidents.canvas() });
  qc.invalidateQueries({ queryKey: queryKeys.alerts });
}

/** Invalidate all RMA-related queries (list, kanban, badges). */
export function invalidateRmaQueries(qc: QueryClient) {
  qc.invalidateQueries({ queryKey: queryKeys.rmas.all });
  qc.invalidateQueries({ queryKey: queryKeys.rmas.canvas() });
  qc.invalidateQueries({ queryKey: queryKeys.alerts });
}
