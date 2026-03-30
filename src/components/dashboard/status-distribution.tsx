"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { INCIDENT_STATUS_LABELS, type IncidentStatus } from "@/lib/constants/incidents";
import type { StatusDistribution as StatusDistributionType } from "@/server/queries/dashboard";

const chartConfig = {
  count: {
    label: "Cantidad",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig;

interface StatusDistributionProps {
  data: StatusDistributionType[];
}

export function StatusDistribution({ data }: StatusDistributionProps) {
  const chartData = data.map((item) => ({
    status: INCIDENT_STATUS_LABELS[item.status as IncidentStatus] ?? item.status,
    count: item.count,
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <BarChart3 className="h-5 w-5 text-muted-foreground" />
        <CardTitle className="text-base font-semibold">Distribución por Estado</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            Sin incidencias activas
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="status"
                tickLine={false}
                axisLine={false}
                fontSize={11}
                width={120}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="count"
                fill="var(--color-chart-1)"
                radius={[0, 4, 4, 0]}
                animationBegin={200}
                animationDuration={800}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
