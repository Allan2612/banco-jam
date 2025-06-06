import { prisma } from "../lib/prisma";
import type { Subscription } from "../models/models";

export async function createSubscription(accountId: string, type: string, alias?: string): Promise<Subscription> {
  return prisma.subscription.create({
    data: { accountId, type, alias }
  });
}

export async function listSubscriptions(): Promise<Subscription[]> {
  return prisma.subscription.findMany();
}