import { prisma } from "../lib/prisma";
import type { User } from "../models/models";

export async function createUser(name: string, email: string, password: string): Promise<User> {
  return prisma.user.create({
    data: { name, email, password }
  });
}

export async function listUsers(): Promise<User[]> {
  return prisma.user.findMany();
}