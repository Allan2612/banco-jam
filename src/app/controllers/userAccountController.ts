import { prisma } from "../lib/prisma";
import type { UserAccount } from "../models/models";

export async function createUserAccount(userId: string, accountId: string, role: string): Promise<UserAccount> {
  return prisma.userAccount.create({
    data: { userId, accountId, role }
  });
}

export async function listUserAccounts(): Promise<UserAccount[]> {
  return prisma.userAccount.findMany();
}