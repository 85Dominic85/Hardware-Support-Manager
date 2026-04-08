"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu } from "lucide-react";
import type { FailingModel } from "@/server/queries/analytics";

interface Props {
  data: FailingModel[];
}

const POSITION_COLORS = [
  "bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-amber-500/30",
  "bg-zinc-400/15 text-zinc-500 dark:text-zinc-400 ring-zinc-400/30",
  "bg-orange-600/15 text-orange-600 dark:text-orange-400 ring-orange-600/30",
];

export function FailingModelsTable({ data }: Props) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Cpu className="h-5 w-5 text-muted-foreground" />
        <CardTitle className="text-base">Modelos con más fallos</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            Sin datos de marca/modelo en incidencias
          </div>
        ) : (
          <div className="space-y-2">
            {data.map((row, i) => (
              <div
                key={`${row.brand}-${row.model}`}
                className="group relative flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 transition-all duration-200 hover:border-border/60 hover:bg-muted/40 hover:shadow-sm hover:-translate-y-px"
                style={{
                  animation: `fadeInUp 400ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 50}ms both`,
                }}
              >
                {/* Position badge */}
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ring-1 ring-inset ${
                    i < 3 ? POSITION_COLORS[i] : "bg-muted text-muted-foreground ring-border"
                  }`}
                >
                  {i + 1}
                </span>

                {/* Brand + Model */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold truncate">{row.brand}</span>
                    <span className="text-sm text-muted-foreground truncate">{row.model}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${(row.count / maxCount) * 100}%`,
                        backgroundColor: i === 0
                          ? "oklch(0.65 0.2 25)"
                          : i === 1
                            ? "oklch(0.65 0.18 45)"
                            : "hsl(var(--chart-1))",
                        animation: `barGrow 800ms cubic-bezier(0.16, 1, 0.3, 1) ${200 + i * 50}ms both`,
                      }}
                    />
                  </div>
                </div>

                {/* Count + Percentage */}
                <div className="shrink-0 text-right">
                  <span className="text-sm font-bold tabular-nums">{row.count}</span>
                  <span className="ml-1.5 text-xs text-muted-foreground tabular-nums">{row.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
