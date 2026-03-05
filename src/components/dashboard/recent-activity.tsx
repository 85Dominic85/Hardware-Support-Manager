import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils/date-format";
import type { RecentActivity as RecentActivityType } from "@/server/queries/dashboard";

interface RecentActivityProps {
  data: RecentActivityType[];
}

const ENTITY_LABELS: Record<string, string> = {
  incident: "Incidencia",
  rma: "RMA",
  event_log: "Evento",
};

export function RecentActivity({ data }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Activity className="h-5 w-5 text-muted-foreground" />
        <CardTitle className="text-base font-semibold">Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            Sin actividad reciente
          </div>
        ) : (
          <ScrollArea className="h-[200px]">
            <div className="space-y-3">
              {data.map((item) => (
                <div key={item.id} className="flex items-start gap-3 rounded-md p-2 hover:bg-muted/50">
                  <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-tight">
                      <span className="font-medium">{item.userName ?? "Sistema"}</span>
                      {" — "}
                      <span className="text-muted-foreground">{item.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      {ENTITY_LABELS[item.entityType] ?? item.entityType}
                      {" · "}
                      {formatRelativeTime(item.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
