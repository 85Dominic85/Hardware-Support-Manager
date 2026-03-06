import { db } from "@/lib/db";
import { attachments, users } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import type { EntityType } from "@/lib/constants/attachments";

export type AttachmentRow = {
  id: string;
  entityType: string;
  entityId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  uploadedBy: string | null;
  uploadedByName: string | null;
  createdAt: Date;
};

export async function getAttachments(
  entityType: EntityType,
  entityId: string
): Promise<AttachmentRow[]> {
  return db
    .select({
      id: attachments.id,
      entityType: attachments.entityType,
      entityId: attachments.entityId,
      fileName: attachments.fileName,
      fileUrl: attachments.fileUrl,
      fileSize: attachments.fileSize,
      fileType: attachments.fileType,
      uploadedBy: attachments.uploadedBy,
      uploadedByName: users.name,
      createdAt: attachments.createdAt,
    })
    .from(attachments)
    .leftJoin(users, eq(attachments.uploadedBy, users.id))
    .where(
      and(
        eq(attachments.entityType, entityType),
        eq(attachments.entityId, entityId)
      )
    )
    .orderBy(desc(attachments.createdAt));
}
