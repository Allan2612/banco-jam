import { prisma } from "../lib/prisma";
import type { User } from "../models/models";

export async function createUser(name: string, email: string, password: string, phone: string): Promise<User> {
  // 1. Crear el usuario
  const user = await prisma.user.create({
    data: { name, email, password }
  });

  // 2. Obtener el último número de cuenta
  const lastAccount = await prisma.account.findFirst({
    orderBy: { number: "desc" }
  });

  // Si no hay cuentas, empieza en 0000000001
  const nextAccountNumber = lastAccount
    ? (parseInt(lastAccount.number, 10) + 1).toString().padStart(10, "0")
    : "0000000001";

  // 3. Generar IBAN realista
  const countryCode = "CR";
  const ibanControl = "21"; // Puedes dejarlo fijo para pruebas
  const bankCode = "0969";
  const branchCode = "0001";
  const controlCode = "00"; // Puedes calcularlo o dejarlo fijo para pruebas

  const iban = `${countryCode}${ibanControl}${bankCode}${branchCode}${controlCode}${nextAccountNumber}`;

  // 4. Crear la cuenta asociada con número e IBAN realistas
  const account = await prisma.account.create({
    data: {
      number: nextAccountNumber,
      iban: iban,
      balance: 5000,
      phone: phone,
      currencyId: "1", // Cambia esto por el ID real de tu moneda
      bankId: "1",     // Cambia esto por el ID real de tu banco
    }
  });

  // 5. Crear la relación en UserAccount
  await prisma.userAccount.create({
    data: {
      userId: user.id,
      accountId: account.id,
      role: "owner"
    }
  });

  // 6. Retornar el usuario con la cuenta asociada
  return prisma.user.findUnique({
    where: { id: user.id },
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