"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FilterOption } from "@/lib/constants/filter-options";

interface FilterMultiSelectProps {
  label: string;
  options: FilterOption[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function FilterMultiSelect({
  label,
  options,
  value,
  onChange,
}: FilterMultiSelectProps) {
  const [open, setOpen] = useState(false);

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 border-dashed"
        >
          {label}
          {value.length > 0 && (
            <Badge
              variant="secondary"
              className="ml-0.5 min-w-[1.25rem] rounded-full px-1.5 py-0 text-xs font-semibold"
            >
              {value.length}
            </Badge>
          )}
          <ChevronDown className="size-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-1" align="start">
        <div className="max-h-64 overflow-y-auto">
          {options.map((option) => {
            const isSelected = value.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => toggleOption(option.value)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors duration-150",
                  "hover:bg-accent hover:text-accent-foreground",
                  isSelected && "bg-accent/50"
                )}
              >
                <div
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded border transition-colors duration-150",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30"
                  )}
                >
                  {isSelected && <Check className="size-3" />}
                </div>
                <span className="truncate">{option.label}</span>
              </button>
            );
          })}
        </div>
        {value.length > 0 && (
          <>
            <div className="my-1 h-px bg-border" />
            <button
              onClick={() => onChange([])}
              className="flex w-full items-center justify-center rounded-sm px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              Limpiar selección
            </button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
