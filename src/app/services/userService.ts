import { User } from "@/app/models/models";
export async function newUser(name: string, email: string, password: string,phone: string, currency: string) {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, phone, currency }),
  });
  return res.json();
}

// Consulta por email y password (NO recomendado para producción)
export async function getUserByEmailAndPassword(email: string, password: string) {
  const res = await fetch(`/api/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
  return res.json();
}

export async function fetchUserById(userId: string): Promise<User | null> {
  console.log("Fetching user by ID:", userId)
  const res = await fetch(`/api/users/user/${userId}`)
  if (!res.ok) return null
  const data = await res.json()
  return data.user || null
}