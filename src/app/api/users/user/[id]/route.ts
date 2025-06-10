import { findUserById } from "@/app/controllers/userController";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop(); // extrae el id de la URL

  if (!id) {
    return Response.json({ success: false, message: "Falta el ID de usuario" }, { status: 400 });
  }

  try {
    const user = await findUserById(id);
    if (!user) {
      return Response.json({ success: false, message: "Usuario no encontrado" }, { status: 404 });
    }
    return Response.json({ success: true, user });
  } catch (err: any) {
    return Response.json({ success: false, message: err.message }, { status: 400 });
  }
}
