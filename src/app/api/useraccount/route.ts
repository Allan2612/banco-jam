import { createUserAccount, listUserAccounts } from "../../controllers/userAccountController";

export async function POST(req: Request) {
  const { userId, accountId, role } = await req.json();
  try {
    const userAccount = await createUserAccount(userId, accountId, role);
    return Response.json({ status: "ACK", userAccount });
  } catch (err: any) {
    return Response.json({ status: "NACK", message: err.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const userAccounts = await listUserAccounts();
    return Response.json({ status: "ACK", userAccounts });
  } catch (err: any) {
    return Response.json({ status: "NACK", message: err.message }, { status: 400 });
  }
}