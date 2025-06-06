import { prisma } from "../lib/prisma";
import type { Bank } from "../models/models";

export async function createBank(code: string, name: string, ip: string, sharedSecret: string): Promise<Bank> {
  return prisma.bank.create({
    data: { code, name, ip, sharedSecret }
  });
}

export async function listBanks(): Promise<Bank[]> {
  return prisma.bank.findMany();
}