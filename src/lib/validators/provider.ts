import { z } from "zod";

export const createProviderSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(255),
  email: z.string().email("Email inválido").max(255).optional().or(z.literal("")),
  phone: z.string().max(50).optional().or(z.literal("")),
  contactPerson: z.string().max(255).optional().or(z.literal("")),
  website: z.string().max(500).optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export const updateProviderSchema = createProviderSchema.partial().required({ name: true });

export type CreateProviderInput = z.infer<typeof createProviderSchema>;
export type UpdateProviderInput = z.infer<typeof updateProviderSchema>;
