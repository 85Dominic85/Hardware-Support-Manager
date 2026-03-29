"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal, X } from "lucide-react";
import type { FilterConfig } from "@/lib/constants/filter-options";
import { FilterMultiSelect } from "./filter-multi-select";
import { FilterDateRange } from "./filter-date-range";

interface FilterBarProps {
  filters: FilterConfig[];
  params: Record<string, unknown>;
  onFilterChange: (key: string, value: string | string[] | null) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

export function FilterBar({
  filters,
  params,
  onFilterChange,
  onClearFilters,
  activeFilterCount,
}: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(activeFilterCount > 0);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="gap-1.5"
        >
          <SlidersHorizontal className="size-3.5" />
          Filtros
          {activeFilterCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-0.5 min-w-[1.25rem] px-1 py-0 text-xs font-semibold bg-primary text-primary-foreground"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="gap-1 text-muted-foreground hover:text-foreground h-8"
          >
            <X className="size-3" />
            Limpiar
          </Button>
        )}
      </div>

      <div
        className="grid transition-[grid-template-rows] duration-[350ms]"
        style={{
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 pb-1 pt-1">
            {filters.map((filter, i) => {
              if (filter.type === "multi-select" && filter.options) {
                const value = (params[filter.key] as string[]) ?? [];
                return (
                  <div
                    key={filter.key}
                    className="opacity-0 animate-[fadeInUp_250ms_ease-out_forwards]"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <FilterMultiSelect
                      label={filter.label}
                      options={filter.options}
                      value={value}
                      onChange={(v) =>
                        onFilterChange(filter.key, v.length > 0 ? v : null)
                      }
                    />
                  </div>
                );
              }

              if (filter.type === "date-range") {
                const from = (params[`${filter.key}From`] as string) ?? undefined;
                const to = (params[`${filter.key}To`] as string) ?? undefined;
                return (
                  <div
                    key={filter.key}
                    className="opacity-0 animate-[fadeInUp_250ms_ease-out_forwards]"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <FilterDateRange
                      label={filter.label}
                      from={from}
                      to={to}
                      onFromChange={(v) =>
                        onFilterChange(`${filter.key}From`, v)
                      }
                      onToChange={(v) =>
                        onFilterChange(`${filter.key}To`, v)
                      }
                    />
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
