export interface AgingResult {
  days: number;
  hours: number;
  minutes: number;
  label: string;
  isOverdue: boolean;
}

export function calculateAging(
  stateChangedAt: Date | string | null | undefined,
  thresholdDays: number = 3
): AgingResult {
  if (!stateChangedAt) {
    return { days: 0, hours: 0, minutes: 0, label: "-", isOverdue: false };
  }

  const changedAt = typeof stateChangedAt === "string" ? new Date(stateChangedAt) : stateChangedAt;
  const now = new Date();
  const diffMs = now.getTime() - changedAt.getTime();

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;

  let label: string;
  if (totalDays > 0) {
    label = `${totalDays}d ${hours}h`;
  } else if (totalHours > 0) {
    label = `${totalHours}h ${minutes}m`;
  } else {
    label = `${minutes}m`;
  }

  return {
    days: totalDays,
    hours,
    minutes,
    label,
    isOverdue: totalDays >= thresholdDays,
  };
}
