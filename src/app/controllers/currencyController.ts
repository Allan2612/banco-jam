import { prisma } from "../lib/prisma";
import type { Currency } from "../models/models";

export async function createCurrency(code: string, name: string, symbol: string): Promise<Currency> {
  return prisma.currency.create({
    data: { code, name, symbol }
  });
}

export async function listCurrencies(): Promise<Currency[]> {
  return prisma.currency.findMany();
}