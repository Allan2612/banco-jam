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
  const data = await res.json();
  if (data.status === "ACK") return data.transfer;
  throw new Error(data.message || "Error en la transferencia");
}

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
  const data = await res.json();
  if (data.status === "ACK") return data.transfer;
  throw new Error(data.message || "Error en la transferencia SINPE");
}

export async function getTransfers() {
  const res = await fetch("/api/transfer");
  const data = await res.json();
  if (data.status === "ACK") return data.transfers;
  throw new Error(data.message || "Error obteniendo transferencias");
}

export async function getUserTransfers(userId: string) {
  const res = await fetch(`/api/transactions?userId=${userId}`);
  const data = await res.json();
  if (data.status === "ACK") return data.transactions;
  throw new Error(data.message || "Error obteniendo transferencias del usuario");
}

export async function newAccountTransferByIban(
  fromId: string,
  toIban: string,
  amount: number,
  status: string,
  transactionId: string,
  currency: string,
  hmacHash: string,
  description?: string | null
) {

  const res = await fetch("/api/transfer/by-iban", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fromId, toIban, amount, status, transactionId, currency, hmacHash, description }),
  });
  const data = await res.json();
  if (data.status === "ACK") return data.transfer;
  throw new Error(data.message || "Error en la transferencia por IBAN");
}