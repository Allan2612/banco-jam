import { createAccount, getAccountById, listAccounts } from "../../controllers/accountController";

export async function POST(req: Request) {
  const { number, iban, balance, currencyId, bankId } = await req.json();
  try {
    const account = await createAccount(number, iban, balance, currencyId, bankId);
    return Response.json({ status: "ACK", account });
  } catch (err: any) {
    return Response.json({ status: "NACK", message: err.message }, { status: 400 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  try {
    if (id) {
      const account = await getAccountById(id);
      if (!account) {
        return Response.json({ status: "NACK", message: "Account not found" }, { status: 404 });
      }
      return Response.json({ status: "ACK", account });
    } else {
      const accounts = await listAccounts();
      return Response.json({ status: "ACK", accounts });
    }
  } catch (err: any) {
    return Response.json({ status: "NACK", message: err.message }, { status: 400 });
  }
}