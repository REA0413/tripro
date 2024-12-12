"use server";

import { db } from "@/db/db";
import { passengerTable, type InsertPassenger } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getPassengers() {
  return await db.select().from(passengerTable);
}

export async function createPassenger(data: InsertPassenger) {
  const [passenger] = await db.insert(passengerTable).values(data).returning();
  return passenger;
}

export async function updatePassenger(id: string, data: Partial<InsertPassenger>) {
  const [passenger] = await db
    .update(passengerTable)
    .set(data)
    .where(eq(passengerTable.id, id))
    .returning();
  return passenger;
}

export async function deletePassenger(id: string) {
  await db.delete(passengerTable).where(eq(passengerTable.id, id));
} 