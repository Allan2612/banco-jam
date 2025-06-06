export async function newUserAccount(userId: string, accountId: string, role: string) {
  const res = await fetch("/api/useraccount", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, accountId, role }),
  });
  return res.json();
}

export async function getUserAccounts() {
  const res = await fetch("/api/useraccount");
  return res.json();
}