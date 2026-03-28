import { z } from "zod";

export const createMessageTemplateSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(255),
  category: z.enum(["cliente", "proveedor"]),
  subject: z.string().max(500).optional().default(""),
  body: z.string().min(1, "El cuerpo es obligatorio"),
  variables: z.array(z.string()).default([]),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const updateMessageTemplateSchema = createMessageTemplateSchema.partial();

/** Form schema — all fields required (form always provides defaultValues) */
export const messageTemplateFormSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(255),
  category: z.enum(["cliente", "proveedor"]),
  subject: z.string().max(500),
  body: z.string().min(1, "El cuerpo es obligatorio"),
  variables: z.array(z.string()),
  sortOrder: z.number().int(),
  isActive: z.boolean(),
});

export type CreateMessageTemplateInput = z.infer<typeof createMessageTemplateSchema>;
export type UpdateMessageTemplateInput = z.infer<typeof updateMessageTemplateSchema>;
export type MessageTemplateFormInput = z.infer<typeof messageTemplateFormSchema>;
