import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { generarHmac } from "@/lib/hmac";

const OUR_BANK_CODE = "969";

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

  // Procesar transferencia: acreditar cuenta destino y registrar transferencia
  try {
    // Buscar cuenta destino por IBAN
    const destAccount = await prisma.account.findUnique({
      where: { iban: receiver.account_number },
    });

    if (!destAccount) {
      return NextResponse.json({ status: "NACK", message: "Cuenta destino no encontrada." }, { status: 404 });
    }

    // Registrar transferencia y acreditar monto
    const transfer = await prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: destAccount.id },
        data: { balance: { increment: amount.value } },
      });
      return tx.transfer.create({
        data: {
          fromId: destAccount.id, // Externo, puedes usar null si el modelo lo permite
          toId: destAccount.id,
          amount: amount.value,
          status: "completed",
          transactionId: transaction_id,
          currency: amount.currency,
          hmacHash: hmac_md5,
          description: description || "",
        },
        include: { to: true },
      });
    });

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