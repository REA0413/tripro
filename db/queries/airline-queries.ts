"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { InsertAirline, SelectAirline, airlineTable } from "../schema/airline-schema";

export const createAirline = async (data: InsertAirline) => {
  try {
    const [newAirline] = await db.insert(airlineTable).values(data).returning();
    return newAirline;
  } catch (error) {
    console.error("Error creating airline:", error);
    throw new Error("Failed to create airline");
  }
};

export const getAirlineById = async (id: string) => {
  try {
    const airline = await db.query.airlineTable.findFirst({
      where: eq(airlineTable.id, id)
    });
    if (!airline) {
      throw new Error("Airline not found");
    }
    return airline;
  } catch (error) {
    console.error("Error getting airline by ID:", error);
    throw new Error("Failed to get the airline requested!");
  }
};

export const getAllAirlines = async (): Promise<SelectAirline[]> => {
  return db.query.airlineTable.findMany();
};

export const updateAirline = async (id: string, data: Partial<InsertAirline>) => {
  try {
    const [updatedAirline] = await db.update(airlineTable).set(data).where(eq(airlineTable.id, id)).returning();
    return updatedAirline;
  } catch (error) {
    console.error("Error updating airline:", error);
    throw new Error("Failed to update airline");
  }
};

export const deleteAirline = async (id: string) => {
  try {
    await db.delete(airlineTable).where(eq(airlineTable.id, id));
  } catch (error) {
    console.error("Error deleting airline:", error);
    throw new Error("Failed to delete airline");
  }
}; 