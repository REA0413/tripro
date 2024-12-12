import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const flightTable = pgTable("flight", {
  id: uuid("id").defaultRandom().primaryKey(),
  flightNumber: text("flight_number").notNull(),
  departureAirport: text("departure_airport").notNull(),
  arrivalAirport: text("arrival_airport").notNull(),
  departureTime: timestamp("departure_time").notNull(),
  arrivalTime: timestamp("arrival_time").notNull(),
  price: integer("price").notNull(),
  availableSeats: integer("available_seats").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
});

export type InsertFlight = typeof flightTable.$inferInsert;
export type SelectFlight = typeof flightTable.$inferSelect; 