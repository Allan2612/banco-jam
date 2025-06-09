import { createLog, listLogs } from "../../controllers/logController";

export async function POST(req: Request) {
  const { action, details, userId } = await req.json();
  try {
    const log = await createLog(action, details, userId);
    return Response.json({ success: true, log });
  } catch (err: any) {
    return Response.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const logs = await listLogs();
    return Response.json({ success: true, logs });
  } catch (err: any) {
    return Response.json({ success: false, message: err.message }, { status: 400 });
  }
}