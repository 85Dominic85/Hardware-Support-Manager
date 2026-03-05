"use client";

import { LayoutGrid, Table2 } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ViewToggleProps {
  view: "table" | "canvas";
  onViewChange: (view: "table" | "canvas") => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={view}
      onValueChange={(v) => {
        if (v) onViewChange(v as "table" | "canvas");
      }}
      className="gap-0 rounded-lg border bg-muted p-0.5"
    >
      <ToggleGroupItem
        value="table"
        aria-label="Vista tabla"
        className="gap-1.5 rounded-md px-3 data-[state=on]:bg-background data-[state=on]:shadow-sm"
      >
        <Table2 className="h-4 w-4" />
        <span className="hidden sm:inline">Tabla</span>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="canvas"
        aria-label="Vista canvas"
        className="gap-1.5 rounded-md px-3 data-[state=on]:bg-background data-[state=on]:shadow-sm"
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="hidden sm:inline">Canvas</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
