import { createCurrency, listCurrencies } from "../../controllers/currencyController";

export async function POST(req: Request) {
  const { code, name, symbol } = await req.json();
  try {
    const currency = await createCurrency(code, name, symbol);
    return Response.json({ success: true, currency });
  } catch (err: any) {
    return Response.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const currencies = await listCurrencies();
    return Response.json({ success: true, currencies });
  } catch (err: any) {
    return Response.json({ success: false, message: err.message }, { status: 400 });
  }
}