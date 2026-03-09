import { z } from "zod";

export const createClientSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(255),
  email: z.string().email("Email inválido").max(255).optional().or(z.literal("")),
  phone: z.string().max(50).optional().or(z.literal("")),
  company: z.string().max(255).optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  clientPnp: z.boolean().optional(),
  notes: z.string().optional().or(z.literal("")),
});

export const updateClientSchema = createClientSchema.partial().required({ name: true });

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
