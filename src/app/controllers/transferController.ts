import { prisma } from "../lib/prisma";

import { BANK_ENDPOINTS } from "@/config/rutas"; // Agrega esta línea
import { generarHmac } from "@/lib/hmac";
import type { Transfer } from "../models/models";
import { exchangeRates } from "@/utils/exchangeRates";

type CurrencyCode = "CRC" | "USD" | "EUR";

function getExchangeRate(from: CurrencyCode, to: CurrencyCode): number {
  if (from === to) return 1;
  return (exchangeRates[from] as Record<CurrencyCode, number>)[to];
}


export async function createAccountTransfer(  fromId: string, toId: string, amount: number, status: string, transactionId: string,currency: string,hmacHash: string,description?: string | null
): Promise<Transfer> {

  return await prisma.$transaction(async (tx) => {
    if (hmacHash !== "VERIFICADO") {
      const hmacData = `${fromId}|${toId}|${amount}|${description || ""}`;
      const expectedHmac = generarHmac(hmacData);
      if (hmacHash !== expectedHmac) {
          await tx.transfer.create({
            data: {
              fromId,toId, amount,status: "failed", transactionId, currency,hmacHash,description,  },});
        throw new Error("HMAC inválido");
      }
    }
    const fromAccount = await tx.account.findUnique({
      where: { id: fromId },
      include: { currency: true },
    });
    const toAccount = await tx.account.findUnique({
      where: { id: toId },
      include: { currency: true },
    });
    if (!fromAccount || !toAccount) {
        await tx.transfer.create({
            data: { fromId, toId,amount,status: "failed", transactionId, currency, hmacHash, description  }, });
      throw new Error("Cuenta origen o destino no encontrada");
    }
    if (fromAccount.balance < amount) {
      await tx.transfer.create({
          data: { fromId,toId,amount, status: "failed", transactionId,  currency,   hmacHash,    description,    },   });
      throw new Error("Saldo insuficiente en la cuenta de origen");
    }
    const fromCur = fromAccount.currency.code as CurrencyCode;
    const toCur = toAccount.currency.code as CurrencyCode;
    const rate = getExchangeRate(fromCur, toCur);
    const creditedAmount = amount * rate;

    await tx.account.update({
      where: { id: fromId },
      data: { balance: { decrement: amount } },
    });
    await tx.account.update({
      where: { id: toId },
      data: { balance: { increment: creditedAmount } },
    })

    return tx.transfer.create({
      data: { fromId,  toId, amount, status, transactionId, currency,hmacHash,description, },});});}


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

export async function createSinpeTransfer(fromId: string,toPhoneNumber: string,amount: number, status: string, transactionId: string, currency: string, hmacHash: string, description?: string | null
): Promise<Transfer> {
  const destAccount = await prisma.account.findFirst({
    where: { phone: toPhoneNumber },
    include: { currency: true },
  });
  if (!destAccount) {
     return buscarSinpeOtrosBancos( fromId, toPhoneNumber, amount, status,transactionId,currency,  hmacHash,  description );
  }

const hmacData = `${fromId}|${toPhoneNumber}|${amount}|${description || ""}`;
const expectedHmac = generarHmac(hmacData);

if (hmacHash !== expectedHmac) {
      await prisma.transfer.create({
        data: {fromId,toId: destAccount.id,amount,status: "failed",transactionId,currency, hmacHash, description, },});
      throw new Error("HMAC inválido para transferencia SINPE");
    }
  return createAccountTransfer(
    fromId, destAccount.id, amount,status,transactionId,currency,"VERIFICADO", );
}

export async function listTransfers(): Promise<Transfer[]> {
  return prisma.transfer.findMany();
}

export async function getUserTransfers(userId: string): Promise<Transfer[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { accounts: true },
  });
  const accountIds = user?.accounts.map((ua) => ua.accountId) || [];

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
  fromId: string,toIban: string,amount: number,status: string,transactionId: string,currency: string,hmacHash: string,description?: string | null
): Promise<Transfer> {
  // Validar formato IBAN
  if (!toIban.startsWith("CR21") || toIban.length < 8) {
    await prisma.transfer.create({
      data: {
        fromId,
        toId: "", 
        amount,
        status: "failed",
        transactionId,
        currency,
        hmacHash,
        description,
      },
    });
    throw new Error("IBAN inválido");
  }
  const bankCode = toIban.substring(4, 8);

  if (bankCode === "0969") {

    // Es nuestro banco, busca la cuenta localmente
    const destAccount = await prisma.account.findUnique({ where: { iban: toIban } });
    if (!destAccount) {
      // Registrar como fallida
      await prisma.transfer.create({
        data: {
          fromId,
          toId: "", 
          amount,
          status: "failed",
          transactionId,
          currency,
          hmacHash,
          description,
        },
      });
      throw new Error("Cuenta destino no encontrada para ese IBAN");
    }

    const hmacData = `${fromId}|${toIban}|${amount}|${description || ""}`;
    const expectedHmac = generarHmac(hmacData);
    if (hmacHash !== expectedHmac) {
      
      throw new Error("HMAC inválido");
    }
    console.log("hash -> " + expectedHmac + " <--")
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
      await prisma.transfer.create({
        data: {
          fromId,
          toId: "", 
          amount,
          status: "failed",
          transactionId,
          currency,
          hmacHash,
          description,
        },
      });
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

  const ownerUserAccount = fromAccount.users.find((ua) => ua.role === "owner") || fromAccount.users[0];
  if (!ownerUserAccount || !ownerUserAccount.user) throw new Error("Usuario titular no encontrado");
  const bankCode = toIban.substring(4, 8);
  const toAccountNumber = toIban.substring(8);
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
  const endpoint = BANK_ENDPOINTS[bankCode];
  if (!endpoint) {
    throw new Error(`No se encontró endpoint para el banco destino (${bankCode})`);
  }

  // Realiza el fetch al endpoint del banco destino
  try {
    const response = await fetch(`${endpoint}/api/sinpe-transfer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonEstandar),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error en el banco destino: ${response.status} - ${errorText}`);
    }

    // Puedes adaptar esto según la respuesta esperada del otro banco
    const result = await response.json();
    return {
      ...result,
      // Completa los campos necesarios según tu modelo Transfer
    } as Transfer;
  } catch (error: any) {
    throw new Error(`Error al transferir a otro banco: ${error.message}`);
  }
}
