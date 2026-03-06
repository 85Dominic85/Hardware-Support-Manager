"use server";

import { getRequiredSession } from "@/lib/auth/get-session";
import { getEventLogs } from "@/server/queries/event-logs";
import type { EventLogRow } from "@/server/queries/event-logs";
import type { EntityType } from "@/lib/constants/attachments";

export async function fetchEventLogs(
  entityType: EntityType,
  entityId: string
): Promise<EventLogRow[]> {
  await getRequiredSession();
  return getEventLogs(entityType, entityId);
}
