export async function newCurrency(code: string, name: string, symbol: string) {
  const res = await fetch("/api/currency", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, name, symbol }),
  });
  return res.json();
}

export async function getCurrencies() {
  const res = await fetch("/api/currency");
  return res.json();
}