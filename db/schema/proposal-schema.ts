import { integer, pgTable, text, timestamp, uuid, real } from "drizzle-orm/pg-core";
import { flightTable } from "./flight-schema";
import { passengerTable } from "./passenger-schema";

export const proposalTable = pgTable("proposal", {
  id: uuid("id").defaultRandom().primaryKey(),
  passengerId: uuid("passenger_id").references(() => passengerTable.id).notNull(),
  flightId: uuid("flight_id").references(() => flightTable.id).notNull(),
  status: text("status", { enum: ["pending", "accepted", "rejected", "negotiating"] }).notNull().default("pending"),
  departureAirport: text("departure_airport").notNull(),
  arrivalAirport: text("arrival_airport").notNull(),
  numberOfPassengers: integer("number_of_passengers").notNull(),
  price: integer("price").notNull(),
  totalPrice: integer("total_price").notNull(),
  timeNeededtoPay: real("time_needed_to_pay").notNull(),
  remark: text("remark"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
});

export type InsertProposal = typeof proposalTable.$inferInsert;
export type SelectProposal = typeof proposalTable.$inferSelect; 