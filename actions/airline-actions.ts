"use server";

import { db } from "@/db/db";
import { airlineTable, type InsertAirline } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getAirlines() {
  return await db.select().from(airlineTable);
}

export async function createAirline(data: InsertAirline) {
  const [airline] = await db.insert(airlineTable).values(data).returning();
  return airline;
}

export async function updateAirline(id: string, data: Partial<InsertAirline>) {
  const [airline] = await db
    .update(airlineTable)
    .set(data)
    .where(eq(airlineTable.id, id))
    .returning();
  return airline;
}

export async function deleteAirline(id: string) {
  await db.delete(airlineTable).where(eq(airlineTable.id, id));
} 