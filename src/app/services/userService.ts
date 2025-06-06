export async function newUser(name: string, email: string, password: string) {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
}

// Consulta por email y password (NO recomendado para producción)
export async function getUserByEmailAndPassword(email: string, password: string) {
  const res = await fetch(`/api/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
  return res.json();
}