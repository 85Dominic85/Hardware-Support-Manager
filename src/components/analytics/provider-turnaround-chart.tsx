"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import type { ProviderTurnaround } from "@/server/queries/analytics";

interface Props {
  data: ProviderTurnaround[];
}

export function ProviderTurnaroundChart({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Turnaround medio por proveedor (días)</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Sin RMAs cerrados</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
              <XAxis type="number" unit="d" />
              <YAxis type="category" dataKey="providerName" width={75} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => [`${value} días`, "Turnaround"]}
              />
              <Bar dataKey="avgDays" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
