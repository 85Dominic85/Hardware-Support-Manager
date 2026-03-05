import { z } from "zod";

export const createRmaSchema = z.object({
  incidentId: z.string().uuid("Incidencia inválida").optional().or(z.literal("")),
  providerId: z.string().uuid("Proveedor inválido"),
  deviceBrand: z.string().max(255).optional().or(z.literal("")),
  deviceModel: z.string().max(255).optional().or(z.literal("")),
  deviceSerialNumber: z.string().max(255).optional().or(z.literal("")),
  trackingNumberOutgoing: z.string().max(255).optional().or(z.literal("")),
  trackingNumberReturn: z.string().max(255).optional().or(z.literal("")),
  providerRmaNumber: z.string().max(255).optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export const updateRmaSchema = createRmaSchema.partial();

export const transitionRmaSchema = z.object({
  rmaId: z.string().uuid(),
  toStatus: z.enum([
    "borrador", "solicitado", "aprobado_proveedor", "enviado_proveedor",
    "recibido_proveedor", "en_reparacion_proveedor", "devuelto",
    "recibido_almacen", "cerrado", "cancelado",
  ]),
  comment: z.string().optional(),
});

export type CreateRmaInput = z.infer<typeof createRmaSchema>;
export type UpdateRmaInput = z.infer<typeof updateRmaSchema>;
export type TransitionRmaInput = z.infer<typeof transitionRmaSchema>;
