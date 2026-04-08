"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import type { DeviceBrandBreakdown } from "@/server/queries/analytics";

interface Props {
  data: DeviceBrandBreakdown[];
}

export function DeviceBrandRanking({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top marcas con más incidencias</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Sin datos</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.slice(0, 10)} layout="vertical" margin={{ left: 80 }}>
              <XAxis type="number" />
              <YAxis type="category" dataKey="brand" width={75} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => [`${value} incidencias`, "Total"]} />
              <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
