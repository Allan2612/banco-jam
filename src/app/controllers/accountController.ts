import { prisma } from "../lib/prisma";
import type { Account } from "../models/models";

export async function createAccount(number: string, iban: string, balance: number, currencyId: string, bankId: string): Promise<Account> {
  return prisma.account.create({
    data: { number, iban, balance, currencyId, bankId }
  });
}

export async function listAccounts(): Promise<Account[]> {
  return prisma.account.findMany();
}

export async function getAccountById(id: string): Promise<Account | null> {
  return prisma.account.findUnique({
    where: { id }
  });
}