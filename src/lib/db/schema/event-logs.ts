import { pgTable, uuid, varchar, timestamp, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";

export const entityTypeEnum = pgEnum("entity_type", ["incident", "rma", "event_log"]);

export const eventLogs = pgTable("event_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  entityType: entityTypeEnum("entity_type").notNull(),
  entityId: uuid("entity_id").notNull(),
  action: varchar("action", { length: 255 }).notNull(),
  fromState: varchar("from_state", { length: 100 }),
  toState: varchar("to_state", { length: 100 }),
  userId: uuid("user_id").references(() => users.id),
  details: jsonb("details"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
