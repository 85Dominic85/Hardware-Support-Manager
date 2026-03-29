"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, X } from "lucide-react";
import { es } from "react-day-picker/locale";

interface FilterDateRangeProps {
  label: string;
  from?: string;
  to?: string;
  onFromChange: (value: string | null) => void;
  onToChange: (value: string | null) => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

export function FilterDateRange({
  label,
  from,
  to,
  onFromChange,
  onToChange,
}: FilterDateRangeProps) {
  const [open, setOpen] = useState(false);

  const hasValue = from || to;

  const selected = {
    from: from ? new Date(from + "T00:00:00") : undefined,
    to: to ? new Date(to + "T00:00:00") : undefined,
  };

  const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (!range) {
      onFromChange(null);
      onToChange(null);
      return;
    }
    if (range.from) {
      onFromChange(range.from.toISOString().split("T")[0]);
    }
    if (range.to) {
      onToChange(range.to.toISOString().split("T")[0]);
    } else if (range.from && !range.to) {
      onToChange(null);
    }
  };

  const displayText = hasValue
    ? `${from ? formatDate(from) : "..."} – ${to ? formatDate(to) : "..."}`
    : label;

  return (
    <div className="flex items-center gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 border-dashed"
          >
            <CalendarDays className="size-3.5" />
            {displayText}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={selected}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={es}
          />
        </PopoverContent>
      </Popover>
      {hasValue && (
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => {
            onFromChange(null);
            onToChange(null);
          }}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="size-3" />
        </Button>
      )}
    </div>
  );
}
