"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { es } from "react-day-picker/locale";
import type { DatePreset } from "@/hooks/use-dashboard-params";

interface DateRangeSelectorProps {
  preset: DatePreset;
  dateFrom: string | null;
  dateTo: string | null;
  onPresetChange: (preset: DatePreset) => void;
  onCustomRange: (from: string | null, to: string | null) => void;
}

const PRESETS: { value: DatePreset; label: string }[] = [
  { value: "7d", label: "7 días" },
  { value: "30d", label: "30 días" },
  { value: "90d", label: "90 días" },
  { value: "all", label: "Todo" },
];

function formatDateRange(from: string | null, to: string | null): string {
  if (!from && !to) return "Todo el periodo";
  const fmt = (d: string) =>
    new Date(d + "T00:00:00").toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });
  if (from && to) return `${fmt(from)} – ${fmt(to)}`;
  if (from) return `Desde ${fmt(from)}`;
  return `Hasta ${fmt(to!)}`;
}

export function DateRangeSelector({
  preset,
  dateFrom,
  dateTo,
  onPresetChange,
  onCustomRange,
}: DateRangeSelectorProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const selected = {
    from: dateFrom ? new Date(dateFrom + "T00:00:00") : undefined,
    to: dateTo ? new Date(dateTo + "T00:00:00") : undefined,
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Preset buttons */}
      <div className="inline-flex items-center rounded-lg border bg-card p-0.5">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            onClick={() => onPresetChange(p.value)}
            className={cn(
              "relative rounded-md px-3 py-1 text-sm font-medium transition-all duration-300",
              preset === p.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            style={{
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom range */}
      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={preset === "custom" ? "default" : "outline"}
            size="sm"
            className="gap-1.5"
          >
            <CalendarDays className="size-3.5" />
            {preset === "custom"
              ? formatDateRange(dateFrom, dateTo)
              : "Personalizado"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={selected}
            onSelect={(range) => {
              if (!range) return;
              const from = range.from
                ? range.from.toISOString().split("T")[0]
                : null;
              const to = range.to
                ? range.to.toISOString().split("T")[0]
                : null;
              onCustomRange(from, to);
              if (from && to) setCalendarOpen(false);
            }}
            numberOfMonths={2}
            locale={es}
          />
        </PopoverContent>
      </Popover>

      {/* Current range display */}
      {preset !== "custom" && preset !== "all" && (
        <span className="text-xs text-muted-foreground">
          {formatDateRange(dateFrom, dateTo)}
        </span>
      )}
    </div>
  );
}
