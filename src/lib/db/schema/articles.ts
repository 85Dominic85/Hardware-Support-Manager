import { uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { hsmSchema } from "./hsm-schema";

export const articles = hsmSchema.table("articles", {
  id: uuid("id").defaultRandom().primaryKey(),
  deviceType: varchar("device_type", { length: 100 }).notNull(),
  brand: varchar("brand", { length: 255 }).notNull(),
  model: varchar("model", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
});
