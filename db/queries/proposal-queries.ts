"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { InsertProposal, SelectProposal, proposalTable } from "../schema/proposal-schema";

export const createProposal = async (data: InsertProposal) => {
  try {
    const [newProposal] = await db.insert(proposalTable).values(data).returning();
    return newProposal;
  } catch (error) {
    console.error("Error creating proposal:", error);
    throw new Error("Failed to create proposal");
  }
};

export const getProposalById = async (id: string) => {
  try {
    const proposal = await db.query.proposalTable.findFirst({
      where: eq(proposalTable.id, id)
    });
    if (!proposal) {
      throw new Error("Proposal not found");
    }
    return proposal;
  } catch (error) {
    console.error("Error getting proposal by ID:", error);
    throw new Error("Failed to get the proposal requested!");
  }
};

export const getProposalsByPassengerId = async (passengerId: string): Promise<SelectProposal[]> => {
  return db.query.proposalTable.findMany({
    where: eq(proposalTable.passengerId, passengerId)
  });
};

export const getProposalsByFlightId = async (flightId: string): Promise<SelectProposal[]> => {
  return db.query.proposalTable.findMany({
    where: eq(proposalTable.flightId, flightId)
  });
};

export const updateProposal = async (id: string, data: Partial<InsertProposal>) => {
  try {
    const [updatedProposal] = await db.update(proposalTable).set(data).where(eq(proposalTable.id, id)).returning();
    return updatedProposal;
  } catch (error) {
    console.error("Error updating proposal:", error);
    throw new Error("Failed to update proposal");
  }
};

export const deleteProposal = async (id: string) => {
  try {
    await db.delete(proposalTable).where(eq(proposalTable.id, id));
  } catch (error) {
    console.error("Error deleting proposal:", error);
    throw new Error("Failed to delete proposal");
  }
}; 