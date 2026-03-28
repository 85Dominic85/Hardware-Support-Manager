"use server";

import { db } from "@/lib/db";
import { messageTemplates } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getRequiredSession } from "@/lib/auth/get-session";
import {
  createMessageTemplateSchema,
  updateMessageTemplateSchema,
} from "@/lib/validators/message-template";
import {
  getMessageTemplates,
  getActiveTemplates,
} from "@/server/queries/message-templates";
import type { ActionResult } from "@/types";
import type { MessageTemplateRow } from "@/server/queries/message-templates";

export async function createMessageTemplate(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  await getRequiredSession();

  const parsed = createMessageTemplateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Datos inválidos" };
  }

  const [row] = await db
    .insert(messageTemplates)
    .values({
      name: parsed.data.name,
      category: parsed.data.category,
      subject: parsed.data.subject || null,
      body: parsed.data.body,
      variables: parsed.data.variables,
      sortOrder: parsed.data.sortOrder,
      isActive: parsed.data.isActive,
    })
    .returning({ id: messageTemplates.id });

  revalidatePath("/settings/templates");
  return { success: true, data: { id: row.id } };
}

export async function updateMessageTemplate(
  id: string,
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  await getRequiredSession();

  const parsed = updateMessageTemplateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Datos inválidos" };
  }

  const values: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) values.name = parsed.data.name;
  if (parsed.data.category !== undefined) values.category = parsed.data.category;
  if (parsed.data.subject !== undefined) values.subject = parsed.data.subject || null;
  if (parsed.data.body !== undefined) values.body = parsed.data.body;
  if (parsed.data.variables !== undefined) values.variables = parsed.data.variables;
  if (parsed.data.sortOrder !== undefined) values.sortOrder = parsed.data.sortOrder;
  if (parsed.data.isActive !== undefined) values.isActive = parsed.data.isActive;

  await db
    .update(messageTemplates)
    .set(values)
    .where(eq(messageTemplates.id, id));

  revalidatePath("/settings/templates");
  return { success: true, data: { id } };
}

export async function deleteMessageTemplate(
  id: string
): Promise<ActionResult> {
  await getRequiredSession();

  await db.delete(messageTemplates).where(eq(messageTemplates.id, id));

  revalidatePath("/settings/templates");
  return { success: true, data: undefined };
}

export async function fetchMessageTemplates(): Promise<MessageTemplateRow[]> {
  await getRequiredSession();
  return getMessageTemplates();
}

export async function fetchActiveTemplates(
  category?: "cliente" | "proveedor"
): Promise<MessageTemplateRow[]> {
  await getRequiredSession();
  return getActiveTemplates(category);
}
