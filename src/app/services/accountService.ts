export async function newAccount(number: string, iban: string, balance: number, currencyId: string, bankId: string) {
  const res = await fetch("/api/account", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ number, iban, balance, currencyId, bankId }),
  });
  const data = await res.json();
  if (data.status === "ACK") return data.account;
  throw new Error(data.message || "Error creando cuenta");
}

export async function getAccountById(id: string) {
  const res = await fetch(`/api/account?id=${encodeURIComponent(id)}`);
  const data = await res.json();
  if (data.status === "ACK") return data.account;
  throw new Error(data.message || "Cuenta no encontrada");
}

export async function getAllAccounts() {
  const res = await fetch("/api/account");
  const data = await res.json();
  if (data.status === "ACK") return data.accounts;
  throw new Error(data.message || "Error obteniendo cuentas");
}