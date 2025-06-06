import { createUser, listUsers } from "../../controllers/userController";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  try {
    const user = await createUser(name, email, password);
    return Response.json({ success: true, user });
  } catch (err: any) {
    return Response.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const users = await listUsers();
    return Response.json({ success: true, users });
  } catch (err: any) {
    return Response.json({ success: false, message: err.message }, { status: 400 });
  }
}