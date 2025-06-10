import { findUserById } from "@/app/controllers/userController";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop(); // extrae el id de la URL

  if (!id) {
    return Response.json({ status: "NACK", message: "Falta el ID de usuario" }, { status: 400 });
  }

  try {
    const user = await findUserById(id);
    if (!user) {
      return Response.json({ status: "NACK", message: "Usuario no encontrado" }, { status: 404 });
    }
    return Response.json({ status: "ACK", user });
  } catch (err: any) {
    return Response.json({ status: "NACK", message: err.message }, { status: 400 });
  }
}