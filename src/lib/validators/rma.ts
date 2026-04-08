import { z } from "zod";

export const createRmaSchema = z.object({
  providerId: z.string().uuid("Proveedor inválido"),
  incidentId: z.string().uuid("Incidencia inválida").optional().or(z.literal("")),
  clientId: z.string().uuid("Cliente inválido").optional().or(z.literal("")),
  clientLocationId: z.string().uuid("Local inválido").optional().or(z.literal("")),
  clientName: z.string().max(500).optional().or(z.literal("")),
  clientExternalId: z.string().max(255).optional().or(z.literal("")),
  clientIntercomUrl: z.string().max(1000).optional().or(z.literal("")),
  articleId: z.string().uuid("Artículo inválido").optional().or(z.literal("")),
  deviceType: z.string().max(100).optional().or(z.literal("")),
  deviceBrand: z.string().max(255).optional().or(z.literal("")),
  deviceModel: z.string().max(255).optional().or(z.literal("")),
  deviceSerialNumber: z.string().max(255).optional().or(z.literal("")),
  clientLocal: z.string().max(255).optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  postalCode: z.string().max(20).optional().or(z.literal("")),
  city: z.string().max(255).optional().or(z.literal("")),
  phone: z.string().max(50).optional().or(z.literal("")),
  trackingNumberOutgoing: z.string().max(255).optional().or(z.literal("")),
  trackingNumberReturn: z.string().max(255).optional().or(z.literal("")),
  providerRmaNumber: z.string().max(255).optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export const updateRmaSchema = z.object({
  providerId: z.string().uuid("Proveedor inválido").optional(),
  incidentId: z.string().uuid("Incidencia inválida").optional().or(z.literal("")),
  clientId: z.string().uuid("Cliente inválido").optional().or(z.literal("")),
  clientLocationId: z.string().uuid("Local inválido").optional().or(z.literal("")),
  clientName: z.string().max(500).optional().or(z.literal("")),
  clientExternalId: z.string().max(255).optional().or(z.literal("")),
  clientIntercomUrl: z.string().max(1000).optional().or(z.literal("")),
  articleId: z.string().uuid("Artículo inválido").optional().or(z.literal("")),
  deviceType: z.string().max(100).optional().or(z.literal("")),
  deviceBrand: z.string().max(255).optional().or(z.literal("")),
  deviceModel: z.string().max(255).optional().or(z.literal("")),
  deviceSerialNumber: z.string().max(255).optional().or(z.literal("")),
  clientLocal: z.string().max(255).optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  postalCode: z.string().max(20).optional().or(z.literal("")),
  city: z.string().max(255).optional().or(z.literal("")),
  phone: z.string().max(50).optional().or(z.literal("")),
  trackingNumberOutgoing: z.string().max(255).optional().or(z.literal("")),
  trackingNumberReturn: z.string().max(255).optional().or(z.literal("")),
  providerRmaNumber: z.string().max(255).optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export const rmaFormSchema = z.object({
  providerId: z.string().uuid("Proveedor inválido"),
  incidentId: z.string().uuid("Incidencia inválida").optional().or(z.literal("")),
  clientId: z.string().uuid("Cliente inválido").optional().or(z.literal("")),
  clientLocationId: z.string().uuid("Local inválido").optional().or(z.literal("")),
  clientName: z.string().max(500).optional().or(z.literal("")),
  clientExternalId: z.string().max(255).optional().or(z.literal("")),
  clientIntercomUrl: z.string().max(1000).optional().or(z.literal("")),
  articleId: z.string().uuid("Artículo inválido").optional().or(z.literal("")),
  deviceType: z.string().max(100).optional().or(z.literal("")),
  deviceBrand: z.string().max(255).optional().or(z.literal("")),
  deviceModel: z.string().max(255).optional().or(z.literal("")),
  deviceSerialNumber: z.string().max(255).optional().or(z.literal("")),
  clientLocal: z.string().max(255).optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  postalCode: z.string().max(20).optional().or(z.literal("")),
  city: z.string().max(255).optional().or(z.literal("")),
  phone: z.string().max(50).optional().or(z.literal("")),
  trackingNumberOutgoing: z.string().max(255).optional().or(z.literal("")),
  trackingNumberReturn: z.string().max(255).optional().or(z.literal("")),
  providerRmaNumber: z.string().max(255).optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export const transitionRmaSchema = z.object({
  rmaId: z.string().uuid(),
  toStatus: z.enum([
    "borrador", "solicitado", "aprobado", "enviado_proveedor",
    "en_proveedor", "devuelto", "recibido_oficina",
    "cerrado", "cancelado",
  ]),
  comment: z.string().optional(),
});

export type CreateRmaInput = z.infer<typeof createRmaSchema>;
export type UpdateRmaInput = z.infer<typeof updateRmaSchema>;
export type RmaFormInput = z.infer<typeof rmaFormSchema>;
export type TransitionRmaInput = z.infer<typeof transitionRmaSchema>;
