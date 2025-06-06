import { createSinpeAlias, listSinpeAliases } from "../../controllers/SinpeAliasController";

export async function POST(req: Request) {
  const { phone, accountId } = await req.json();
  try {
    const alias = await createSinpeAlias(phone, accountId);
    return Response.json({ success: true, alias });
  } catch (err: any) {
    return Response.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const aliases = await listSinpeAliases();
    return Response.json({ success: true, aliases });
  } catch (err: any) {
    return Response.json({ success: false, message: err.message }, { status: 400 });
  }
}