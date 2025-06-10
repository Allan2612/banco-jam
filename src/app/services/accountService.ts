export async function newAccount(number: string, iban: string, balance: number, currencyId: string, bankId: string) {
  const res = await fetch("/api/account", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ number, iban, balance, currencyId, bankId }),
  });
  return res.json();
}

export async function getAccountById(id: string) {
  const res = await fetch(`/api/account?id=${encodeURIComponent(id)}`);
  return res.json();
}
export async function getAllAccounts() {
  const res = await fetch("/api/account");
  return res.json();
}