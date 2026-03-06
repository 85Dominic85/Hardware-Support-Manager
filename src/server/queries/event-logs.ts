import { db } from "@/lib/db";
import { eventLogs, users } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import type { EntityType } from "@/lib/constants/attachments";

export type EventLogRow = {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  fromState: string | null;
  toState: string | null;
  userId: string | null;
  userName: string | null;
  details: unknown;
  createdAt: Date;
};

export async function getEventLogs(
  entityType: EntityType,
  entityId: string
): Promise<EventLogRow[]> {
  return db
    .select({
      id: eventLogs.id,
      entityType: eventLogs.entityType,
      entityId: eventLogs.entityId,
      action: eventLogs.action,
      fromState: eventLogs.fromState,
      toState: eventLogs.toState,
      userId: eventLogs.userId,
      userName: users.name,
      details: eventLogs.details,
      createdAt: eventLogs.createdAt,
    })
    .from(eventLogs)
    .leftJoin(users, eq(eventLogs.userId, users.id))
    .where(
      and(
        eq(eventLogs.entityType, entityType),
        eq(eventLogs.entityId, entityId)
      )
    )
    .orderBy(desc(eventLogs.createdAt));
}
