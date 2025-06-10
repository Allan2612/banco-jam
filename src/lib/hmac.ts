import crypto from "crypto";

const SECRET = "supersecreta123"; // Usa la clave compartida

export function generarHmac(data: string) {
  return crypto.createHmac("sha256", SECRET).update(data).digest("hex");
}