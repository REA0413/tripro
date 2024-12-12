"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { InsertPassenger, SelectPassenger } from "../schema/passenger-schema";
import { passengerTable } from "./../schema/passenger-schema";

export const createPassenger = async (data: InsertPassenger) => {
  try {
    const [newPassenger] = await db.insert(passengerTable).values(data).returning();
    return newPassenger;
  } catch (error) {
    console.error("Error creating passenger:", error);
    throw new Error("Failed to create passenger");
  }
};

export const getPassengerById = async (id: string) => {
  try {
    const passenger = await db.query.passengerTable.findFirst({
      where: eq(passengerTable.id, id)
    });
    if (!passenger) {
      throw new Error("Passenger not found");
    }
    return passenger;
  } catch (error) {
    console.error("Error getting passenger by ID:", error);
    throw new Error("Failed to get the passenger requested!");
  }
};

export const getAllPassenger = async (): Promise<SelectPassenger[]> => {
  return db.query.passengerTable.findMany();
};

export const updatePassenger = async (id: string, data: Partial<InsertPassenger>) => {
  try {
    const [updatedPassenger] = await db.update(passengerTable).set(data).where(eq(passengerTable.id, id)).returning();
    return updatedPassenger;
  } catch (error) {
    console.error("Error updating passenger:", error);
    throw new Error("Failed to update passenger");
  }
};

export const deletePassenger = async (id: string) => {
  try {
    await db.delete(passengerTable).where(eq(passengerTable.id, id));
  } catch (error) {
    console.error("Error deleting passenger:", error);
    throw new Error("Failed to delete passenger");
  }
}; 