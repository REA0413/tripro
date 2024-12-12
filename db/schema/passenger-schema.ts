import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const passengerTable = pgTable("passenger", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
});

export type InsertPassenger = typeof passengerTable.$inferInsert;
export type SelectPassenger = typeof passengerTable.$inferSelect; 