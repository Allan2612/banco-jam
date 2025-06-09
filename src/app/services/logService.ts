export async function newLog(action: string, details: string, userId?: string) {
  const res = await fetch("/api/log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, details, userId }),
  });
  return res.json();
}

export async function getLogs() {
  const res = await fetch("/api/log");
  return res.json();
}