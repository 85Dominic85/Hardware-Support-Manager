import { uuid, varchar, text, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { hsmSchema } from "./hsm-schema";

export const templateCategoryEnum = hsmSchema.enum("template_category", [
  "cliente",
  "proveedor",
]);

export const messageTemplates = hsmSchema.table("message_templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: templateCategoryEnum("category").notNull().default("cliente"),
  subject: varchar("subject", { length: 500 }),
  body: text("body").notNull().default(""),
  variables: jsonb("variables").$type<string[]>().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
});
