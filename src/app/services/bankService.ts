export async function newBank(code: string, name: string, ip: string, sharedSecret: string) {
  const res = await fetch("/api/bank", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, name, ip, sharedSecret }),
  });
  return res.json();
}

export async function getBanks() {
  const res = await fetch("/api/bank");
  return res.json();
}