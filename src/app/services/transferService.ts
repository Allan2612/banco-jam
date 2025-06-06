export async function newTransfer(
  fromId: string,
  toId: string,
  amount: number,
  status: string,
  transactionId: string,
  currency: string,
  hmacHash: string,
  description?: string | null
) {
  const res = await fetch("/api/transfer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fromId, toId, amount, status, transactionId, currency, hmacHash, description }),
  });
  return res.json();
}

export async function getTransfers() {
  const res = await fetch("/api/transfer");
  return res.json();
}