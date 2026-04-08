"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, LabelList } from "recharts";
import { CheckCircle } from "lucide-react";
import type { ProviderSuccessRate } from "@/server/queries/analytics";

interface Props {
  data: ProviderSuccessRate[];
}

function rateColor(rate: number): string {
  if (rate >= 80) return "oklch(0.75 0.15 85)";
  if (rate >= 50) return "oklch(0.75 0.15 65)";
  return "oklch(0.577 0.245 27.325)";
}

export function ProviderSuccessRateChart({ data }: Props) {
  return (
    <Card
      style={{ animation: "fadeInUp 500ms cubic-bezier(0.16, 1, 0.3, 1) 100ms both" }}
    >
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <CheckCircle className="h-5 w-5 text-muted-foreground" />
        <CardTitle className="text-base">Tasa de éxito por proveedor</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            Sin RMAs finalizados
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 5, right: 50 }}
              barCategoryGap="20%"
            >
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis
                type="category"
                dataKey="providerName"
                width={80}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value: number) => [`${value}%`, "Tasa éxito"]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  backgroundColor: "hsl(var(--popover))",
                  color: "hsl(var(--popover-foreground))",
                  fontSize: "12px",
                }}
              />
              <Bar
                dataKey="rate"
                radius={[0, 6, 6, 0]}
                animationBegin={200}
                animationDuration={800}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={rateColor(entry.rate)} />
                ))}
                <LabelList
                  dataKey="rate"
                  position="right"
                  formatter={(v: number) => `${v}%`}
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
