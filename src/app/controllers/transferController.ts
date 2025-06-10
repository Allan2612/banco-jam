// controllers/transferController.ts

import { prisma } from "../lib/prisma";
import type { Transfer } from "../models/models";
import { exchangeRates } from "@/utils/exchangeRates";

//
// Constantes y tipos
//
type CurrencyCode = "CRC" | "USD" | "EUR";

//
// Helper para obtener la tasa de cambio entre dos divisas
//
function getExchangeRate(from: CurrencyCode, to: CurrencyCode): number {
  if (from === to) return 1;
  return (exchangeRates[from] as Record<CurrencyCode, number>)[to];
}

//
// 1) Transferencia tradicional por cuenta (ID)
//
export async function createAccountTransfer(
  fromId: string,
  toId: string,
  amount: number,
  status: string,
  transactionId: string,
  currency: string,
  hmacHash: string,
  description?: string | null
): Promise<Transfer> {
  return prisma.$transaction(async (tx) => {
    // Cargar ambas cuentas con su moneda
    const fromAccount = await tx.account.findUnique({
      where: { id: fromId },
      include: { currency: true },
    });
    const toAccount = await tx.account.findUnique({
      where: { id: toId },
      include: { currency: true },
    });

    if (!fromAccount || !toAccount) {
      throw new Error("Cuenta origen o destino no encontrada");
    }
    if (fromAccount.balance < amount) {
      throw new Error("Saldo insuficiente en la cuenta de origen");
    }

    // Cálculo de conversión si las divisas difieren
    const fromCur = fromAccount.currency.code as CurrencyCode;
    const toCur = toAccount.currency.code as CurrencyCode;
    const rate = getExchangeRate(fromCur, toCur);
    const creditedAmount = amount * rate;

    // Actualizar balances
    await tx.account.update({
      where: { id: fromId },
      data: { balance: { decrement: amount } },
    });
    await tx.account.update({
      where: { id: toId },
      data: { balance: { increment: creditedAmount } },
    });

    // Registrar la transferencia
    return tx.transfer.create({
      data: {
        fromId,
        toId,
        amount,
        status,
        transactionId,
        currency,
        hmacHash,
        description,
      },
    });
  });
}

//
// 2) Transferencia SINPE por teléfono
//
export async function createSinpeTransfer(
  fromId: string,
  toPhoneNumber: string,
  amount: number,
  status: string,
  transactionId: string,
  currency: string,
  hmacHash: string,
  description?: string | null
): Promise<Transfer> {
  // Buscar la cuenta destino por teléfono e incluir su moneda
  const destAccount = await prisma.account.findFirst({
    where: { phone: toPhoneNumber },
    include: { currency: true },
  });
  if (!destAccount) {
    throw new Error("Cuenta destino no encontrada para ese teléfono");
  }

  // Delegar en createAccountTransfer para reutilizar la lógica
  return createAccountTransfer(
    fromId,
    destAccount.id,
    amount,
    status,
    transactionId,
    currency,
    hmacHash,
    description
  );
}

//
// 3) Listar todas las transferencias
//
export async function listTransfers(): Promise<Transfer[]> {
  return prisma.transfer.findMany();
}

//
// 4) Obtener historial de un usuario (por sus cuentas)
//
export async function getUserTransfers(userId: string): Promise<Transfer[]> {
  // Cargar IDs de todas las cuentas del usuario
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { accounts: true },
  });
  const accountIds = user?.accounts.map((ua) => ua.accountId) || [];

  // Buscar transferencias donde participa como origen o destino
  return prisma.transfer.findMany({
    where: {
      OR: [
        { fromId: { in: accountIds } },
        { toId: { in: accountIds } },
      ],
    },
    orderBy: { date: "desc" },
    include: {
      from: true,
      to: true,
    },
  });
}
