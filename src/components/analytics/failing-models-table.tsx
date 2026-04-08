"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FailingModel } from "@/server/queries/analytics";

interface Props {
  data: FailingModel[];
}

export function FailingModelsTable({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Modelos con más fallos</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Sin datos de marca/modelo en incidencias</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-2 px-3 font-medium">Marca</th>
                  <th className="text-left py-2 px-3 font-medium">Modelo</th>
                  <th className="text-right py-2 px-3 font-medium">Incidencias</th>
                  <th className="text-right py-2 px-3 font-medium">%</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-2 px-3 font-medium">{row.brand}</td>
                    <td className="py-2 px-3">{row.model}</td>
                    <td className="py-2 px-3 text-right tabular-nums">{row.count}</td>
                    <td className="py-2 px-3 text-right tabular-nums text-muted-foreground">{row.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
