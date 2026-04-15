import { db } from "@/lib/db";
import { messageTemplates } from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";

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
  const conditions = category
    ? and(eq(messageTemplates.isActive, true), eq(messageTemplates.category, category))
    : eq(messageTemplates.isActive, true);

  return db
    .select()
    .from(messageTemplates)
    .where(conditions)
    .orderBy(asc(messageTemplates.sortOrder), asc(messageTemplates.name));
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
