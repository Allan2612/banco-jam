import { createAccount, getAccountById } from "../../controllers/accountController";

export async function POST(req: Request) {
  const { number, iban, balance, currencyId, bankId } = await req.json();
  try {
    const account = await createAccount(number, iban, balance, currencyId, bankId);
    return Response.json({ success: true, account });
  } catch (err: any) {
    return Response.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return Response.json({ success: false, message: "Missing account id" }, { status: 400 });
  }
  try {
    const account = await getAccountById(id);
    if (!account) {
      return Response.json({ success: false, message: "Account not found" }, { status: 404 });
    }
    return Response.json({ success: true, account });
  } catch (err: any) {
    return Response.json({ success: false, message: err.message }, { status: 400 });
  }
}