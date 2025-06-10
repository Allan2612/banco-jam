// controllers/transferController.ts

import { prisma } from "../lib/prisma";

import { generarHmac } from "@/lib/hmac";
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


async function buscarSinpeOtrosBancos(
  fromId: string,
  toPhoneNumber: string,
  amount: number,
  status: string,
  transactionId: string,
  currency: string,
  hmacHash: string,
  description?: string | null
): Promise<Transfer> {
  // TODO: implementar lógica para SINPE a otros bancos
  // - Armar payload
  // - Enviar request
  // - Procesar respuesta
  // - Crear registro de Transfer (o manejos de error)
  throw new Error("SINPE a otros bancos aún no implementado o no existe");
}

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
     return buscarSinpeOtrosBancos(
      fromId,
      toPhoneNumber,
      amount,
      status,
      transactionId,
      currency,
      hmacHash,
      description
    );
  }

const hmacData = `${fromId}|${toPhoneNumber}|${amount}|${description || ""}`;
const expectedHmac = generarHmac(hmacData);

console.log("SINPE HMAC Debug:");
console.log(" raw string    =", JSON.stringify(hmacData));
console.log(" expectedHmac  =", expectedHmac);
console.log(" client hmac   =", hmacHash);

if (hmacHash !== expectedHmac) {
  throw new Error("HMAC inválido para transferencia SINPE");
}

  // Delegar en createAccountTransfer para reutilizar la lógica
  return createAccountTransfer(
    fromId,
    destAccount.id,
    amount,
    status,
    transactionId,
    currency,
    "VERIFICADO", // Asumimos que el HMAC ya fue verificado
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
  // Obtén la cuenta de origen con su usuario y banco
  const fromAccount = await prisma.account.findUnique({
    where: { id: fromId },
    include: {
      bank: true,
      users: {
        include: { user: true },
      },
    },
  });
  if (!fromAccount) throw new Error("Cuenta origen no encontrada");

  // Obtén el usuario titular (primer usuario con rol "owner" o el primero si solo hay uno)
  const ownerUserAccount = fromAccount.users.find((ua) => ua.role === "owner") || fromAccount.users[0];
  if (!ownerUserAccount || !ownerUserAccount.user) throw new Error("Usuario titular no encontrado");

  // Obtén el banco destino por el código en el IBAN
  const bankCode = toIban.substring(4, 8);
  //const toBank = await prisma.bank.findUnique({ where: { code: bankCode } });

  // Arma el número de cuenta destino (sin IBAN)
  const toAccountNumber = toIban.substring(8); // Asume que después del código de banco viene el número

  // Arma el JSON estándar
  const jsonEstandar = {
    version: "1.0",
    timestamp: new Date().toISOString(),
    transaction_id: transactionId,
    sender: {
      account_number: fromAccount.number,
      bank_code: fromAccount.bank.code,
      name: ownerUserAccount.user.name,
    },
    receiver: {
      account_number: toAccountNumber,
      bank_code: bankCode,
      name: "", 
    },
    amount: {
      value: amount,
      currency: currency,
    },
    description: description || "",
    hmac_md5: generarHmac(
      `${transactionId}|${fromAccount.number}|${fromAccount.bank.code}|${toAccountNumber}|${bankCode}|${amount}|${currency}|${description || ""}`
    ),
  };

  // Aquí deberías hacer el fetch/post al endpoint del otro banco usando jsonEstandar
  console.log("JSON a enviar a otro banco:", jsonEstandar);

  // Simula la respuesta (puedes lanzar error o retornar un mock)
  throw new Error("Transferencia a otros bancos aún no implementada");
}

