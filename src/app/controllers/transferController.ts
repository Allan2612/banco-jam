import { prisma } from "../lib/prisma";
import type { Transfer,User,Bank  } from "../models/models";
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
  const toBank = await prisma.bank.findUnique({ where: { code: bankCode } });

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