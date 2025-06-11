import crypto from "crypto";

const SECRET = "supersecreta123"; // Usa la clave compartida

export function generarHmac(data: string) {
 return crypto.createHmac("md5", SECRET).update(data).digest("hex");
}