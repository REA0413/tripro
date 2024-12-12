"use server";

import { eq, and, gte, lte } from "drizzle-orm";
import { db } from "../db";
import { InsertFlight, SelectFlight, flightTable } from "../schema/flight-schema";

export const createFlight = async (data: InsertFlight) => {
  try {
    const [newFlight] = await db.insert(flightTable).values(data).returning();
    return newFlight;
  } catch (error) {
    console.error("Error creating flight:", error);
    throw new Error("Failed to create flight");
  }
};

export const getFlightById = async (id: string) => {
  try {
    const flight = await db.query.flightTable.findFirst({
      where: eq(flightTable.id, id)
    });
    if (!flight) {
      throw new Error("Flight not found");
    }
    return flight;
  } catch (error) {
    console.error("Error getting flight by ID:", error);
    throw new Error("Failed to get the flight requested!");
  }
};

export const getAllFlights = async (): Promise<SelectFlight[]> => {
  return db.query.flightTable.findMany();
};

export const searchFlights = async (
  departureAirport: string,
  arrivalAirport: string,
  departureDate: Date
): Promise<SelectFlight[]> => {
  const startOfDay = new Date(departureDate);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(departureDate);
  endOfDay.setHours(23, 59, 59, 999);

  return db.query.flightTable.findMany({
    where: and(
      eq(flightTable.departureAirport, departureAirport),
      eq(flightTable.arrivalAirport, arrivalAirport),
      gte(flightTable.departureTime, startOfDay),
      lte(flightTable.departureTime, endOfDay)
    )
  });
};

export const updateFlight = async (id: string, data: Partial<InsertFlight>) => {
  try {
    const [updatedFlight] = await db.update(flightTable).set(data).where(eq(flightTable.id, id)).returning();
    return updatedFlight;
  } catch (error) {
    console.error("Error updating flight:", error);
    throw new Error("Failed to update flight");
  }
};

export const deleteFlight = async (id: string) => {
  try {
    await db.delete(flightTable).where(eq(flightTable.id, id));
  } catch (error) {
    console.error("Error deleting flight:", error);
    throw new Error("Failed to delete flight");
  }
}; 