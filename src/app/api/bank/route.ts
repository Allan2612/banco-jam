import { createBank, listBanks } from "../../controllers/bankController";

export async function POST(req: Request) {
  const { code, name, ip, sharedSecret } = await req.json();
  try {
    const bank = await createBank(code, name, ip, sharedSecret);
    return Response.json({ success: true, bank });
  } catch (err: any) {
    return Response.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const banks = await listBanks();
    return Response.json({ success: true, banks });
  } catch (err: any) {
    return Response.json({ success: false, message: err.message }, { status: 400 });
  }
}