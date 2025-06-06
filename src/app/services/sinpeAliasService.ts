export async function newSinpeAlias(phone: string, accountId: string) {
  const res = await fetch("/api/sinpealias", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, accountId }),
  });
  return res.json();
}

export async function getSinpeAliases() {
  const res = await fetch("/api/sinpealias");
  return res.json();
}