"use client";

import { useCallback, useMemo } from "react";
import { useQueryStates, parseAsString } from "nuqs";

export type DatePreset = "7d" | "30d" | "90d" | "all" | "custom";

export interface DateRangeParams {
  dateFrom?: string;
  dateTo?: string;
}

function getPresetRange(preset: DatePreset): { dateFrom: string | null; dateTo: string | null } {
  if (preset === "all") return { dateFrom: null, dateTo: null };
  if (preset === "custom") return { dateFrom: null, dateTo: null };

  const days = preset === "7d" ? 7 : preset === "30d" ? 30 : 90;
  const from = new Date();
  from.setDate(from.getDate() - days);
  return {
    dateFrom: from.toISOString().split("T")[0],
    dateTo: new Date().toISOString().split("T")[0],
  };
}

export function useDashboardParams() {
  const [params, setParams] = useQueryStates(
    {
      dateFrom: parseAsString,
      dateTo: parseAsString,
      preset: parseAsString.withDefault("30d"),
    },
    { shallow: false }
  );

  const setPreset = useCallback(
    (preset: DatePreset) => {
      const range = getPresetRange(preset);
      setParams({ preset, ...range });
    },
    [setParams]
  );

  const setCustomRange = useCallback(
    (dateFrom: string | null, dateTo: string | null) => {
      setParams({ preset: "custom", dateFrom, dateTo });
    },
    [setParams]
  );

  const dateRange: DateRangeParams = useMemo(() => {
    // For presets, compute the range dynamically
    if (params.preset !== "custom" && params.preset !== "all") {
      const range = getPresetRange(params.preset as DatePreset);
      return {
        dateFrom: range.dateFrom ?? undefined,
        dateTo: range.dateTo ?? undefined,
      };
    }
    return {
      dateFrom: params.dateFrom ?? undefined,
      dateTo: params.dateTo ?? undefined,
    };
  }, [params]);

  return {
    preset: params.preset as DatePreset,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    dateRange,
    setPreset,
    setCustomRange,
  };
}
