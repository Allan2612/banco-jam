import { createTransfer, listTransfers } from "../../controllers/transferController";

export async function POST(req: Request) {
  const { fromId, toId, amount, status, transactionId, currency, hmacHash, description } = await req.json();
  try {
    const transfer = await createTransfer(fromId, toId, amount, status, transactionId, currency, hmacHash, description);
    return Response.json({ success: true, transfer });
  } catch (err: any) {
    return Response.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const transfers = await listTransfers();
    return Response.json({ success: true, transfers });
  } catch (err: any) {
    return Response.json({ success: false, message: err.message }, { status: 400 });
  }
}