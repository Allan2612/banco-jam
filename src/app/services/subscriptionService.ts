export async function newSubscription(accountId: string, type: string, alias?: string) {
  const res = await fetch("/api/subscription", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accountId, type, alias }),
  });
  return res.json();
}

export async function getSubscriptions() {
  const res = await fetch("/api/subscription");
  return res.json();
}