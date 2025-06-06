"use client";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      setMessage("Usuario creado exitosamente 🎉");
      // Consulta el usuario recién creado
      const getRes = await fetch(`/api/users?email=${encodeURIComponent(email)}`);
      if (getRes.ok) {
        const data = await getRes.json();
        setUserData(data.user || data.users || data); // Ajusta según tu endpoint
      } else {
        setUserData(null);
      }
      setName("");
      setEmail("");
      setPassword("");
    } else {
      setMessage("Error al crear usuario ❌");
      setUserData(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl font-bold underline text-center">
          Testear endpoint de usuario
        </h1>
        <Image src="/jam.png" alt="Logo JAM" width={50} height={50} />
      </div>

      <form onSubmit={handleSubmit} className="mt-12 space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-64"
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded w-64"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-64"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Crear usuario
        </button>
        {message && <p className="mt-2 text-center">{message}</p>}
      </form>

      {userData && (
        <div className="mt-8 p-4 border rounded bg-gray-100">
          <h2 className="font-bold mb-2">Usuario consultado:</h2>
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}