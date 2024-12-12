"use server";

import { db } from "@/db/db";
import { proposalTable, type InsertProposal } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getProposals() {
  return await db.select().from(proposalTable);
}

export async function createProposal(data: InsertProposal) {
  const [proposal] = await db.insert(proposalTable).values(data).returning();
  return proposal;
}

export async function createProposalAction(data: InsertProposal) {
  return createProposal(data);
}

export async function updateProposal(id: string, data: Partial<InsertProposal>) {
  const [proposal] = await db
    .update(proposalTable)
    .set(data)
    .where(eq(proposalTable.id, id))
    .returning();
  return proposal;
}

export async function deleteProposal(id: string) {
  await db.delete(proposalTable).where(eq(proposalTable.id, id));
} 