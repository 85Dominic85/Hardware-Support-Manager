"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, LabelList } from "recharts";
import { Award } from "lucide-react";
import type { DeviceBrandBreakdown } from "@/server/queries/analytics";

interface Props {
  data: DeviceBrandBreakdown[];
}

export function DeviceBrandRanking({ data }: Props) {
  return (
    <Card
      style={{ animation: "fadeInUp 500ms cubic-bezier(0.16, 1, 0.3, 1) 100ms both" }}
    >
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Award className="h-5 w-5 text-muted-foreground" />
        <CardTitle className="text-base">Top marcas con más incidencias</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            Sin datos
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data.slice(0, 10)}
              layout="vertical"
              margin={{ left: 5, right: 40 }}
              barCategoryGap="20%"
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="brand"
                width={80}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value: number) => [`${value} incidencias`, "Total"]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  backgroundColor: "hsl(var(--popover))",
                  color: "hsl(var(--popover-foreground))",
                  fontSize: "12px",
                }}
                itemStyle={{ color: "hsl(var(--popover-foreground))" }}
              />
              <Bar
                dataKey="count"
                radius={[0, 6, 6, 0]}
                animationBegin={200}
                animationDuration={800}
              >
                {data.slice(0, 10).map((_, i) => (
                  <Cell
                    key={i}
                    fill={i === 0 ? "oklch(0.577 0.245 27.325)" : i === 1 ? "oklch(0.65 0.18 45)" : "hsl(var(--chart-1))"}
                    opacity={1 - i * 0.06}
                  />
                ))}
                <LabelList
                  dataKey="count"
                  position="right"
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
