import { prisma } from "../lib/prisma";
import type { Transfer } from "../models/models";
import { exchangeRates } from "@/utils/exchangeRates";

// Transferencia tradicional por cuenta (ID)
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
  return await prisma.$transaction(async (tx) => {
   const fromAccount = await tx.account.findUnique({
      where: { id: fromId },
      include: { currency: true }
    });
    const toAccount = await tx.account.findUnique({
      where: { id: toId },
      include: { currency: true }
    });

    if (!fromAccount || !toAccount) {
      throw new Error("Cuenta origen o destino no encontrada");
    }
    if (fromAccount.balance < amount) {
      throw new Error("Saldo insuficiente en la cuenta de origen");
    }
    

function getExchangeRate(
  from: "CRC" | "USD" | "EUR",
  to: "CRC" | "USD" | "EUR"
): number {
  if (from === to) return 1;
  return exchangeRates[from][to as keyof typeof exchangeRates[typeof from]];
}

let creditedAmount = amount;
const validCurrencies = ["CRC", "USD", "EUR"] as const;
type CurrencyCode = typeof validCurrencies[number];
    const fromCur = fromAccount.currency.code as CurrencyCode;
    const toCur = toAccount.currency.code as CurrencyCode;

    if (
      fromCur !== toCur &&
      validCurrencies.includes(fromCur) &&
      validCurrencies.includes(toCur)
    ) {
      creditedAmount = amount * getExchangeRate(fromCur, toCur);
    }

    await tx.account.update({
      where: { id: fromId },
      data: { balance: { decrement: amount } }
    });
    await tx.account.update({
      where: { id: toId },
      data: { balance: { increment: creditedAmount } }
    });

    return tx.transfer.create({
      data: { fromId, toId, amount, status, transactionId, currency, hmacHash, description }
    });
  });
}

// Transferencia SINPE por teléfono
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
  // Buscar cuenta destino por teléfono
  const destAccount = await prisma.account.findFirst({ where: { phone: toPhoneNumber } });
  if (!destAccount) throw new Error("Cuenta destino no encontrada para ese teléfono");

  // Reutiliza la lógica de transferencia por cuenta
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

export async function listTransfers(): Promise<Transfer[]> {
  return prisma.transfer.findMany();
}

export async function getUserTransfers(userId: string): Promise<Transfer[]> {
  // Busca todas las cuentas asociadas al usuario
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { accounts: true },
  });

  const accountIds = user?.accounts.map(ua => ua.accountId) || [];

  // Busca todas las transferencias donde el usuario es origen o destino
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