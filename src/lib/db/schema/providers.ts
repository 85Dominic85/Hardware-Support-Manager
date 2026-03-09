import { uuid, varchar, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { hsmSchema } from "./hsm-schema";
import type { ProviderContact } from "@/types";

export const providers = hsmSchema.table("providers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  website: varchar("website", { length: 500 }),
  rmaUrl: varchar("rma_url", { length: 500 }),
  contacts: jsonb("contacts").$type<ProviderContact[]>().default([]),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});
