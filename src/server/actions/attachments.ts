"use server";

import { db } from "@/lib/db";
import { attachments, eventLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getRequiredSession } from "@/lib/auth/get-session";
import { vercelBlobStorage } from "@/lib/storage/vercel-blob";
import { getAttachments } from "@/server/queries/attachments";
import type { AttachmentRow } from "@/server/queries/attachments";
import type { ActionResult } from "@/types";
import type { EntityType } from "@/lib/constants/attachments";

interface CreateAttachmentInput {
  entityType: EntityType;
  entityId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
}

export async function createAttachment(
  input: CreateAttachmentInput
): Promise<ActionResult<{ id: string }>> {
  const session = await getRequiredSession();

  const [attachment] = await db.transaction(async (tx) => {
    const [att] = await tx
      .insert(attachments)
      .values({
        entityType: input.entityType,
        entityId: input.entityId,
        fileName: input.fileName,
        fileUrl: input.fileUrl,
        fileSize: input.fileSize,
        fileType: input.fileType,
        uploadedBy: session.user.id,
      })
      .returning({ id: attachments.id });

    await tx.insert(eventLogs).values({
      entityType: input.entityType,
      entityId: input.entityId,
      action: "attachment_added",
      userId: session.user.id,
      details: { fileName: input.fileName },
    });

    return [att];
  });

  const basePath =
    input.entityType === "incident" ? "/incidents" : "/rmas";
  revalidatePath(`${basePath}/${input.entityId}`);
  return { success: true, data: { id: attachment.id } };
}

export async function deleteAttachment(
  id: string
): Promise<ActionResult> {
  const session = await getRequiredSession();

  const [attachment] = await db
    .select()
    .from(attachments)
    .where(eq(attachments.id, id))
    .limit(1);

  if (!attachment) {
    return { success: false, error: "Adjunto no encontrado" };
  }

  try {
    await vercelBlobStorage.delete(attachment.fileUrl);
  } catch {
    // Storage delete may fail if file doesn't exist; continue with DB cleanup
  }

  await db.transaction(async (tx) => {
    await tx.delete(attachments).where(eq(attachments.id, id));

    await tx.insert(eventLogs).values({
      entityType: attachment.entityType,
      entityId: attachment.entityId,
      action: "attachment_removed",
      userId: session.user.id,
      details: { fileName: attachment.fileName },
    });
  });

  const basePath =
    attachment.entityType === "incident" ? "/incidents" : "/rmas";
  revalidatePath(`${basePath}/${attachment.entityId}`);
  return { success: true, data: undefined };
}

export async function fetchAttachments(
  entityType: EntityType,
  entityId: string
): Promise<AttachmentRow[]> {
  await getRequiredSession();
  return getAttachments(entityType, entityId);
}
