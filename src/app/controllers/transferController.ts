import { prisma } from "../lib/prisma";
import type { Transfer } from "../models/models";

export async function createTransfer(
  fromId: string,
  toId: string,
  amount: number,
  status: string,
  transactionId: string,
  currency: string,
  hmacHash: string,
  description?: string | null
): Promise<Transfer> {
  return prisma.transfer.create({
    data: { fromId, toId, amount, status, transactionId, currency, hmacHash, description }
  });
}

export async function listTransfers(): Promise<Transfer[]> {
  return prisma.transfer.findMany();
}