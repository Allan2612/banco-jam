import { createUser, findUserByEmailAndPassword } from "../../controllers/userController";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("BODY RECIBIDO:", body); // <-- Agrega esto
  const { name, email, password, phone, currency } = body;
  if (!name || !email || !password || !phone || !currency) {
    return Response.json({ success: false, message: "Faltan parámetros" }, { status: 400 });
  }
  try {
    const user = await createUser(name, email, password, phone, currency);
     return Response.json({ status: "ACK", user });
  } catch (err: any) {
    return Response.json({ status: "NACK", message: err.message }, { status: 400 });
  }
}

// Login de usuario (POST a /api/users/login)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const password = searchParams.get("password");
  if (!email || !password) {
    return Response.json({ status: "NACK", message: "Faltan parámetros" }, { status: 400 });
  }
  try {
    const user = await findUserByEmailAndPassword(email, password);
    if (!user) {
      return Response.json({ status: "NACK", message: "Usuario o contraseña incorrectos" }, { status: 401 });
    }
    return Response.json({ status: "ACK", user });
  } catch (err: any) {
    return Response.json({ status: "NACK", message: err.message }, { status: 400 });
  }
}