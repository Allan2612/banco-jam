import { NextRequest } from "next/server";
import { getUserTransfers } from "@/app/controllers/transferController";

export async function GET(req: NextRequest) {
  try {
    // Obtén el userId de los query params
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ status: "NACK", message: "Falta userId" }, { status: 400 });
    }

    const transfers = await getUserTransfers(userId);
    return Response.json({ status: "ACK", transactions: transfers });
  } catch (err: any) {
    return Response.json({ status: "NACK", message: err.message }, { status: 500 });
  }
}