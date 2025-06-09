import { createSinpeTransfer } from "../../controllers/transferController";

export async function POST(req: Request) {
  const { fromId, toPhoneNumber, amount, status, transactionId, currency, hmacHash, description } = await req.json();
  try {
    const transfer = await createSinpeTransfer(fromId, toPhoneNumber, amount, status, transactionId, currency, hmacHash, description);
    return Response.json({ success: true, transfer });
  } catch (err: any) {
    return Response.json({ success: false, message: err.message }, { status: 400 });
  }
}