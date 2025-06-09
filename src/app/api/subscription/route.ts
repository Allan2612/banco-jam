import { createSubscription, listSubscriptions } from "../../controllers/subscriptionController";

export async function POST(req: Request) {
  const { accountId, type, alias } = await req.json();
  try {
    const subscription = await createSubscription(accountId, type, alias);
    return Response.json({ success: true, subscription });
  } catch (err: any) {
    return Response.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const subscriptions = await listSubscriptions();
    return Response.json({ success: true, subscriptions });
  } catch (err: any) {
    return Response.json({ success: false, message: err.message }, { status: 400 });
  }
}