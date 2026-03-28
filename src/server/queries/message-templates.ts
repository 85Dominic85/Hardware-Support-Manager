import { db } from "@/lib/db";
import { messageTemplates } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export type MessageTemplateRow = typeof messageTemplates.$inferSelect;

export async function getMessageTemplates(): Promise<MessageTemplateRow[]> {
  return db
    .select()
    .from(messageTemplates)
    .orderBy(asc(messageTemplates.sortOrder), asc(messageTemplates.name));
}

export async function getActiveTemplates(
  category?: "cliente" | "proveedor"
): Promise<MessageTemplateRow[]> {
  const query = db
    .select()
    .from(messageTemplates)
    .where(eq(messageTemplates.isActive, true))
    .orderBy(asc(messageTemplates.sortOrder), asc(messageTemplates.name));

  if (category) {
    return db
      .select()
      .from(messageTemplates)
      .where(
        eq(messageTemplates.isActive, true)
      )
      .orderBy(asc(messageTemplates.sortOrder), asc(messageTemplates.name));
  }

  return query;
}

export async function getMessageTemplateById(
  id: string
): Promise<MessageTemplateRow | undefined> {
  const [row] = await db
    .select()
    .from(messageTemplates)
    .where(eq(messageTemplates.id, id))
    .limit(1);
  return row;
}
