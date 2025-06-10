import { User } from "@/app/models/models";

export async function newUser(name: string, email: string, password: string, phone: string): Promise<User> {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, phone }),
  });
  const data = await res.json();
  if (data.status === "ACK") return data.user;
  throw new Error(data.message || "Error creando usuario");
}

export async function getUserByEmailAndPassword(email: string, password: string): Promise<User> {
  const res = await fetch(`/api/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
  const data = await res.json();
  if (data.status === "ACK") return data.user;
  throw new Error(data.message || "Usuario o contraseña incorrectos");
}

export async function fetchUserById(userId: string): Promise<User | null> {
  const res = await fetch(`/api/users/user/${userId}`);
  const data = await res.json();
  if (data.status === "ACK") return data.user;
  return null;
}