import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface CanvasColumn {
  id: string;
  label: string;
  color: string;
  items: React.ReactNode[];
}

interface CanvasViewProps {
  columns: CanvasColumn[];
}

export function CanvasView({ columns }: CanvasViewProps) {
  return (
    <ScrollArea className="w-full">
      <div className="flex gap-4 pb-4" style={{ minWidth: `${columns.length * 300}px` }}>
        {columns.map((col) => (
          <div
            key={col.id}
            className="flex w-[280px] shrink-0 flex-col rounded-lg border bg-muted/30"
          >
            {/* Column header with color bar */}
            <div
              className="h-1 rounded-t-lg"
              style={{ backgroundColor: col.color }}
            />
            <div className="flex items-center justify-between px-3 py-2">
              <h3 className="text-sm font-semibold">{col.label}</h3>
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-xs font-medium text-muted-foreground">
                {col.items.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-2 px-2 pb-2">
              {col.items.length === 0 ? (
                <div className="flex h-20 items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground">
                  Sin elementos
                </div>
              ) : (
                col.items
              )}
            </div>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
