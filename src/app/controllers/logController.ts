import { prisma } from "../lib/prisma";
import type { Log } from "../models/models";

export async function createLog(action: string, details: string, userId?: string): Promise<Log> {
  return prisma.log.create({
    data: { action, details, userId }
  });
}

export async function listLogs(): Promise<Log[]> {
  return prisma.log.findMany();
}