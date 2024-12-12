import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const airlineTable = pgTable("airline", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  country: text("country").notNull(),
  logo: text("logo"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
});

export type InsertAirline = typeof airlineTable.$inferInsert;
export type SelectAirline = typeof airlineTable.$inferSelect; 