export async function newUserAccount(userId: string, accountId: string, role: string) {
  const res = await fetch("/api/useraccount", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, accountId, role }),
  });
  const data = await res.json();
  if (data.status === "ACK") return data.userAccount;
  throw new Error(data.message || "Error creando relación usuario-cuenta");
}

export async function getUserAccounts() {
  const res = await fetch("/api/useraccount");
  const data = await res.json();
  if (data.status === "ACK") return data.userAccounts;
  throw new Error(data.message || "Error obteniendo relaciones usuario-cuenta");
}