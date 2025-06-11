import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { generarHmac } from "@/lib/hmac";
import { createAccountTransfer } from "@/app/controllers/transferController";

const OUR_BANK_CODE = "969";
const currencyIdMap: Record<string, string> = {
  CRC: "2",
  USD: "1",
  EUR: "3",
};
export async function POST(req: NextRequest) {
  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ status: "NACK", message: "JSON inválido en body." }, { status: 400 });
  }

  const {
    version,
    timestamp,
    transaction_id,
    sender,
    receiver,
    amount,
    description,
    hmac_md5,
  } = payload;

  // Validación de campos obligatorios
  if (
    !version ||
    !timestamp ||
    !transaction_id ||
    !receiver?.account_number ||
    !receiver?.bank_code ||
    !amount?.value ||
    !amount?.currency ||
    !hmac_md5
  ) {
    return NextResponse.json({ status: "NACK", message: "Faltan campos requeridos." }, { status: 400 });
  }

  // Verificar HMAC
  const amountValue: number = amount.value;
  const expectedHmac = generarHmac(
    `${sender.account_number}${timestamp}${transaction_id}${amountValue.toFixed(2)}`
  );
  if (hmac_md5 !== expectedHmac) {
    return NextResponse.json({ status: "NACK", message: "HMAC inválido." }, { status: 401 });
  }

  // Determinar currencyId usando el mapa
  const currencyId = currencyIdMap[amount.currency] || amount.currency;

  // Procesar transferencia: acreditar cuenta destino y registrar transferencia
  try {
    // Buscar cuenta destino por IBAN
    const destAccount = await prisma.account.findUnique({
      where: { iban: receiver.account_number },
    });

    if (!destAccount) {
      return NextResponse.json({ status: "NACK", message: "Cuenta destino no encontrada." }, { status: 404 });
    }

    // Buscar o crear cuenta origen (banco externo)
    let fromAccount = await prisma.account.findUnique({
      where: { iban: sender.account_number },
    });

    if (!fromAccount) {
      fromAccount = await prisma.account.create({
        data: {
          iban: sender.account_number,
          number: sender.account_number,
          balance: 0,
          currencyId: currencyId, // Usa la misma moneda que la cuenta destino
          bankId: "1", // Asigna el código del banco
        },
      });
    }

    const transfer = await createAccountTransfer(
      fromAccount.id,
      destAccount.id,
      amount.value,
      "completed",
      transaction_id,
      currencyId,
      "VERIFICADO",
      description || ""
    );

    return NextResponse.json({ status: "ACK", transfer }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { status: "NACK", message: err.message || "Error interno procesando crédito externo." },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.next();
}