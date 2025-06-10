import { prisma } from "@/app/lib/prisma";
import { createAccount, getAccountById, listAccounts } from "../../controllers/accountController";

export async function POST(req: Request) {
  const { number, iban, balance, currency, bankId } = await req.json();
  try {
    const foundCurrency = await prisma.currency.findUnique({
      where: { code: currency }
    });
    if (!foundCurrency) {
      return Response.json({ success: false, message: "Divisa no encontrada" }, { status: 400 });
    }

    const account = await createAccount(number, iban, balance, foundCurrency.id, bankId);
    return Response.json({ success: true, account });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    return Response.json({ success: false, message }, { status: 400 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  try {
    if (id) {
      const account = await getAccountById(id);
      if (!account) {
        return Response.json({ success: false, message: "Account not found" }, { status: 404 });
      }
      return Response.json({ success: true, account });
    } else {
      const accounts = await listAccounts();
      return Response.json({ success: true, accounts });
    }
  } catch (err: any) {
    return Response.json({ success: false, message: err.message }, { status: 400 });
  }
}