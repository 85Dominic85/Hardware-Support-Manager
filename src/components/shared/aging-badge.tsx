import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { calculateAging } from "@/lib/utils/aging";

interface AgingBadgeProps {
  stateChangedAt: Date | string | null | undefined;
  thresholdDays?: number;
}

export function AgingBadge({ stateChangedAt, thresholdDays = 3 }: AgingBadgeProps) {
  const aging = calculateAging(stateChangedAt, thresholdDays);

  if (aging.label === "-") return null;

  let colorClass: string;
  if (aging.days >= thresholdDays) {
    colorClass = "bg-red-100 text-red-700 hover:bg-red-100";
  } else if (aging.days >= 1) {
    colorClass = "bg-amber-100 text-amber-700 hover:bg-amber-100";
  } else {
    colorClass = "bg-green-100 text-green-700 hover:bg-green-100";
  }

  return (
    <Badge variant="outline" className={`gap-1 ${colorClass}`}>
      <Clock className="h-3 w-3" />
      {aging.label}
    </Badge>
  );
}
