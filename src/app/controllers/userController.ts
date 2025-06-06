import { prisma } from "../lib/prisma";
import type { User } from "../models/models";

export async function createUser(name: string, email: string, password: string): Promise<User> {
  return prisma.user.create({
    data: { name, email, password }
  });
}


export async function findUserByEmailAndPassword(email: string, password: string): Promise<User | null> {
  return prisma.user.findFirst({
    where: { email, password }
  });
}