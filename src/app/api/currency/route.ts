import { createCurrency, listCurrencies } from "../../controllers/currencyController";

export async function POST(req: Request) {
  const { code, name, symbol } = await req.json();
  try {
    const currency = await createCurrency(code, name, symbol);
    return Response.json({ status: "ACK", currency });
  } catch (err: any) {
    return Response.json({ status: "NACK", message: err.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const currencies = await listCurrencies();
    return Response.json({ status: "ACK", currencies });
  } catch (err: any) {
    return Response.json({ status: "NACK", message: err.message }, { status: 400 });
  }
}