import { z } from "zod";

export const uploadAttachmentSchema = z.object({
  entityType: z.enum(["incident", "rma", "event_log"]),
  entityId: z.string().uuid("Entidad inválida"),
});

export type UploadAttachmentInput = z.infer<typeof uploadAttachmentSchema>;
