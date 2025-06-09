import { prisma } from "../lib/prisma";
import type { User } from "../models/models";

export async function createUser(name: string, email: string, password: string,phone:string): Promise<User> {
  // 1. Crear el usuario
  const user = await prisma.user.create({
    data: { name, email, password }
  });

  // 2. Obtener el último número de cuenta
  const lastAccount = await prisma.account.findFirst({
    orderBy: { number: "desc" }
  });

  // Si no hay cuentas, empieza en 100000 (o el número que prefieras)
  const nextNumber = lastAccount ? (parseInt(lastAccount.number, 10) + 1).toString() : "1";

  // 3. Crear la cuenta asociada con número e IBAN consecutivos
  const account = await prisma.account.create({
    data: {
      number: nextNumber,
      iban: `IBAN${nextNumber}`, // Puedes formatear el IBAN si lo deseas, por ahora igual al número
      balance: 0,
      phone: phone, // Agregar el teléfono a la cuenta
      currencyId: "1", // Cambia esto por el ID real de tu moneda
      bankId: "1",     // Cambia esto por el ID real de tu banco
    }
  });

  // 4. Crear la relación en UserAccount
  await prisma.userAccount.create({
    data: {
      userId: user.id,
      accountId: account.id,
      role: "owner"
    }
  });

  // 5. Retornar el usuario con la cuenta asociada
  return prisma.user.findUnique({
    where: { id: user.id },
    include: {
      accounts: {
        take: 1, // Solo el primer UserAccount
        include: {
          account: {
            include: {
              currency: true // Incluye currency en la cuenta
            }
          }
        }
      }
    }
  }) as unknown as User;
}

export async function findUserByEmailAndPassword(email: string, password: string): Promise<User | null> {
  return prisma.user.findFirst({
    where: { email, password },
    include: {
      accounts: {
        take: 1, // Solo el primer UserAccount
        include: {
          account: {
            include: {
              currency: true // Incluye currency en la cuenta
            }
          }
        }
      }
    }
  }) as unknown as User;
}
export async function findUserById(id: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      accounts: {
        take: 1,
        include: {
          account: {
            include: {
              currency: true
            }
          }
        }
      }
    }
  }) as unknown as User;
  return user;
}