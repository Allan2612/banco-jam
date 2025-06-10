import { prisma } from "../lib/prisma";
import type { Transfer } from "../models/models";
import { generarHmac } from "@/lib/hmac";
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
    if (hmacHash !== "VERIFICADO") {
      const hmacData = `${fromId}|${toId}|${amount}|${description || ""}`;
      const expectedHmac = generarHmac(hmacData);
      if (hmacHash !== expectedHmac) {
        throw new Error("HMAC inválido");
      }
    }
    const fromAccount = await tx.account.findUnique({ where: { id: fromId } });
    const toAccount = await tx.account.findUnique({ where: { id: toId } });

    if (!fromAccount || !toAccount) {
      throw new Error("Cuenta origen o destino no encontrada");
    }
    if (fromAccount.balance < amount) {
      throw new Error("Saldo insuficiente en la cuenta de origen");
    }

    await tx.account.update({
      where: { id: fromId },
      data: { balance: { decrement: amount } }
    });
    await tx.account.update({
      where: { id: toId },
      data: { balance: { increment: amount } }
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

export async function createAccountTransferByIban(
  fromId: string,
  toIban: string,
  amount: number,
  status: string,
  transactionId: string,
  currency: string,
  hmacHash: string,
  description?: string | null
): Promise<Transfer> {
  // Validar formato IBAN
  if (!toIban.startsWith("CR21") || toIban.length < 8) {
    throw new Error("IBAN inválido");
  }
  const bankCode = toIban.substring(4, 8);

  if (bankCode === "0969") {

    // Es nuestro banco, busca la cuenta localmente
    const destAccount = await prisma.account.findUnique({ where: { iban: toIban } });
    if (!destAccount) throw new Error("Cuenta destino no encontrada para ese IBAN");

    const hmacData = `${fromId}|${toIban}|${amount}|${description || ""}`;
    const expectedHmac = generarHmac(hmacData);
    if (hmacHash !== expectedHmac) {
      throw new Error("HMAC inválido");
    }
    console.log("hash -> "+ expectedHmac+" <--")
    // Reutiliza la lógica de transferencia por cuenta
    return createAccountTransfer(
      fromId,
      destAccount.id,
      amount,
      status,
      transactionId,
      currency,
      "VERIFICADO",
      description
    );
  } else {
    // Es otro banco, llama a un método placeholder
    const hmacData = `${fromId}|${toIban}|${amount}|${description || ""}`;
    const expectedHmac = generarHmac(hmacData);
    if (hmacHash !== expectedHmac) {
      throw new Error("HMAC inválido");
    }
    
    return transferToOtherBankByIban(
      fromId,
      toIban,
      amount,
      status,
      transactionId,
      currency,
      hmacHash,
      description
    );
  }
}

// Placeholder para transferencias a otros bancos (lógica a desarrollar)
export async function transferToOtherBankByIban(
  fromId: string,
  toIban: string,
  amount: number,
  status: string,
  transactionId: string,
  currency: string,
  hmacHash: string,
  description?: string | null
): Promise<Transfer> {
  // Por ahora solo lanza un error o retorna un mock
  throw new Error("Transferencia a otros bancos aún no implementada");
  // O puedes retornar un objeto simulado si prefieres:
  // return {
  //   id: "mock-id",
  //   fromId,
  //   toId: "externo",
  //   amount,
  //   status,
  //   transactionId,
  //   currency,
  //   hmacHash,
  //   description,
  //   date: new Date(),
  // };
}