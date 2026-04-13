import {
  INCIDENT_STATUS_LABELS,
  INCIDENT_PRIORITY_LABELS,
  INCIDENT_CATEGORY_LABELS,
} from "./incidents";
import { RMA_STATUS_LABELS } from "./rmas";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: "multi-select" | "single-select" | "date-range";
  options?: FilterOption[];
}

function labelsToOptions(labels: Record<string, string>): FilterOption[] {
  return Object.entries(labels).map(([value, label]) => ({ value, label }));
}

/** Static incident filters (status, priority, category, date) */
const INCIDENT_STATIC_FILTERS: FilterConfig[] = [
  {
    key: "status",
    label: "Estado",
    type: "multi-select",
    options: labelsToOptions(INCIDENT_STATUS_LABELS),
  },
  {
    key: "priority",
    label: "Prioridad",
    type: "multi-select",
    options: labelsToOptions(INCIDENT_PRIORITY_LABELS),
  },
  {
    key: "category",
    label: "Categoría",
    type: "multi-select",
    options: labelsToOptions(INCIDENT_CATEGORY_LABELS),
  },
];

/** Build incident filters with optional dynamic options (assigned users) */
export function buildIncidentFilters(userOptions?: FilterOption[]): FilterConfig[] {
  const filters = [...INCIDENT_STATIC_FILTERS];
  if (userOptions && userOptions.length > 0) {
    filters.push({
      key: "assignedUserId",
      label: "Asignado",
      type: "multi-select",
      options: userOptions,
    });
  }
  filters.push({ key: "dateRange", label: "Fecha", type: "date-range" });
  return filters;
}

/** Backward-compatible constant (no dynamic options) */
export const INCIDENT_FILTERS: FilterConfig[] = buildIncidentFilters();

/** Static RMA filters */
const RMA_STATIC_FILTERS: FilterConfig[] = [
  {
    key: "status",
    label: "Estado",
    type: "multi-select",
    options: labelsToOptions(RMA_STATUS_LABELS),
  },
];

/** Build RMA filters with optional dynamic options (providers) */
export function buildRmaFilters(providerOptions?: FilterOption[]): FilterConfig[] {
  const filters = [...RMA_STATIC_FILTERS];
  if (providerOptions && providerOptions.length > 0) {
    filters.push({
      key: "providerId",
      label: "Proveedor",
      type: "multi-select",
      options: providerOptions,
    });
  }
  filters.push({ key: "dateRange", label: "Fecha", type: "date-range" });
  return filters;
}

/** Backward-compatible constant (no dynamic options) */
export const RMA_FILTERS: FilterConfig[] = buildRmaFilters();

export const CLIENT_FILTERS: FilterConfig[] = [
  {
    key: "dateRange",
    label: "Fecha",
    type: "date-range",
  },
];
