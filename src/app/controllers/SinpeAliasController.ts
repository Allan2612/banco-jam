import { prisma } from "../lib/prisma";
import type { SinpeAlias } from "../models/models";

export async function createSinpeAlias(phone: string, accountId: string): Promise<SinpeAlias> {
  return prisma.sinpeAlias.create({
    data: { phone, accountId }
  });
}

export async function listSinpeAliases(): Promise<SinpeAlias[]> {
  return prisma.sinpeAlias.findMany();
}