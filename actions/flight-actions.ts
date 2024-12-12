"use server";

import { db } from "@/db/db";
import { flightTable, type InsertFlight } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getFlights() {
  return await db.select().from(flightTable);
}

export async function createFlight(data: InsertFlight) {
  const [flight] = await db.insert(flightTable).values(data).returning();
  return flight;
}

export async function updateFlight(id: string, data: Partial<InsertFlight>) {
  const [flight] = await db
    .update(flightTable)
    .set(data)
    .where(eq(flightTable.id, id))
    .returning();
  return flight;
}

export async function deleteFlight(id: string) {
  await db.delete(flightTable).where(eq(flightTable.id, id));
} 