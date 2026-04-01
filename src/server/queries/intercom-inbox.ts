import { db } from "@/lib/db";
import { intercomInbox, incidents } from "@/lib/db/schema";
import { eq, desc, count, and, ilike, sql } from "drizzle-orm";
import type { IntercomInboxStatus } from "@/lib/constants/intercom";
import type { PaginationParams } from "@/types";

export type IntercomInboxRow = typeof intercomInbox.$inferSelect & {
  convertedIncidentNumber: string | null;
};

export async function getIntercomInboxItems(
  params: PaginationParams & { status?: IntercomInboxStatus }
) {
  const { page = 1, pageSize = 20, search, status } = params;
  const offset = (page - 1) * pageSize;

  const conditions = [];
  if (status) {
    conditions.push(eq(intercomInbox.status, status));
  }
  if (search) {
    conditions.push(
      sql`(${ilike(intercomInbox.contactName, `%${search}%`)} OR ${ilike(intercomInbox.contactEmail, `%${search}%`)} OR ${ilike(intercomInbox.subject, `%${search}%`)})`
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [items, totalResult] = await Promise.all([
    db
      .select({
        id: intercomInbox.id,
        intercomConversationId: intercomInbox.intercomConversationId,
        status: intercomInbox.status,
        contactName: intercomInbox.contactName,
        contactEmail: intercomInbox.contactEmail,
        subject: intercomInbox.subject,
        assigneeName: intercomInbox.assigneeName,
        rawPayload: intercomInbox.rawPayload,
        convertedIncidentId: intercomInbox.convertedIncidentId,
        convertedByUserId: intercomInbox.convertedByUserId,
        convertedAt: intercomInbox.convertedAt,
        dismissedByUserId: intercomInbox.dismissedByUserId,
        dismissedAt: intercomInbox.dismissedAt,
        receivedAt: intercomInbox.receivedAt,
        updatedAt: intercomInbox.updatedAt,
        convertedIncidentNumber: incidents.incidentNumber,
      })
      .from(intercomInbox)
      .leftJoin(incidents, eq(intercomInbox.convertedIncidentId, incidents.id))
      .where(whereClause)
      .orderBy(desc(intercomInbox.receivedAt))
      .limit(pageSize)
      .offset(offset),
    db
      .select({ count: count() })
      .from(intercomInbox)
      .where(whereClause),
  ]);

  const totalCount = totalResult[0].count;

  return {
    data: items as IntercomInboxRow[],
    totalCount,
    page,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

export async function getPendingInboxCount(): Promise<number> {
  const [result] = await db
    .select({ count: count() })
    .from(intercomInbox)
    .where(eq(intercomInbox.status, "pendiente"));
  return result.count;
}
