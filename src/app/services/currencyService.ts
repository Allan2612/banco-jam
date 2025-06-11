export async function newCurrency(code: string, name: string, symbol: string) {
  const res = await fetch("/api/currency", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, name, symbol }),
  });
  const data = await res.json();
  if (data.status === "ACK") return data.currency;
  throw new Error(data.message || "Error creando moneda");
}

export async function getCurrencies() {
  const res = await fetch("/api/currency");
  const data = await res.json();
  if (data.status === "ACK") return data.currencies;
  throw new Error(data.message || "Error obteniendo monedas");
}