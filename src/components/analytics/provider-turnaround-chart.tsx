"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, LabelList } from "recharts";
import { Clock } from "lucide-react";
import type { ProviderTurnaround } from "@/server/queries/analytics";

interface Props {
  data: ProviderTurnaround[];
}

function turnaroundColor(days: number): string {
  if (days <= 7) return "oklch(0.75 0.15 85)";
  if (days <= 14) return "oklch(0.75 0.15 65)";
  return "oklch(0.577 0.245 27.325)";
}

export function ProviderTurnaroundChart({ data }: Props) {
  return (
    <Card
      style={{ animation: "fadeInUp 500ms cubic-bezier(0.16, 1, 0.3, 1) both" }}
    >
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <CardTitle className="text-base">Turnaround medio por proveedor (días)</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            Sin RMAs cerrados
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 5, right: 50 }}
              barCategoryGap="20%"
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="providerName"
                width={80}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value: number) => [`${value} días`, "Turnaround"]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  backgroundColor: "hsl(var(--popover))",
                  color: "hsl(var(--popover-foreground))",
                  fontSize: "12px",
                }}
              />
              <Bar
                dataKey="avgDays"
                radius={[0, 6, 6, 0]}
                animationBegin={200}
                animationDuration={800}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={turnaroundColor(entry.avgDays)} />
                ))}
                <LabelList
                  dataKey="avgDays"
                  position="right"
                  formatter={(v: number) => `${v}d`}
                  style={{ fontSize: 11, fontWeight: 600, fill: "hsl(var(--muted-foreground))" }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
