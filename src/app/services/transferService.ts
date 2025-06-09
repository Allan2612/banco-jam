// Transferencia tradicional por cuenta (ID)
export async function newAccountTransfer(
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

// Transferencia SINPE por teléfono
export async function newSinpeTransfer(
  fromId: string,
  toPhoneNumber: string,
  amount: number,
  status: string,
  transactionId: string,
  currency: string,
  hmacHash: string,
  description?: string | null
) {
  const res = await fetch("/api/transfer-sinpe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fromId, toPhoneNumber, amount, status, transactionId, currency, hmacHash, description }),
  });
  return res.json();
}

export async function getTransfers() {
  const res = await fetch("/api/transfer");
  return res.json();
}