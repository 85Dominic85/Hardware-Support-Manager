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

export const INCIDENT_FILTERS: FilterConfig[] = [
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
  {
    key: "dateRange",
    label: "Fecha",
    type: "date-range",
  },
];

export const RMA_FILTERS: FilterConfig[] = [
  {
    key: "status",
    label: "Estado",
    type: "multi-select",
    options: labelsToOptions(RMA_STATUS_LABELS),
  },
  {
    key: "dateRange",
    label: "Fecha",
    type: "date-range",
  },
];

export const CLIENT_FILTERS: FilterConfig[] = [
  {
    key: "dateRange",
    label: "Fecha",
    type: "date-range",
  },
];
