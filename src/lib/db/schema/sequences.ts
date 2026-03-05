import { pgTable, uuid, varchar, integer, uniqueIndex } from "drizzle-orm/pg-core";

export const sequences = pgTable("sequences", {
  id: uuid("id").defaultRandom().primaryKey(),
  prefix: varchar("prefix", { length: 10 }).notNull(),
  year: integer("year").notNull(),
  lastValue: integer("last_value").notNull().default(0),
}, (table) => [
  uniqueIndex("sequences_prefix_year_idx").on(table.prefix, table.year),
]);
