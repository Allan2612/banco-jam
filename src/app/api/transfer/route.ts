import { createAccountTransfer, listTransfers } from "../../controllers/transferController";

export async function POST(req: Request) {
  const { fromId, toId, amount, status, transactionId, currency, hmacHash, description } = await req.json();
  try {
    const transfer = await createAccountTransfer(
      fromId,
      toId,
      amount,
      status,
      transactionId,
      currency,
      hmacHash,
      description
    );
    return Response.json({ status: "ACK", transfer });
  } catch (err: any) {
    return Response.json({ status: "NACK", message: err.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const transfers = await listTransfers();
    return Response.json({ status: "ACK", transfers });
  } catch (err: any) {
    return Response.json({ status: "NACK", message: err.message }, { status: 400 });
  }
}