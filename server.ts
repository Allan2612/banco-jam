import express from "express";
import https from "https";
import fs from "fs";

const app = express();

// Tu configuración de rutas aquí
app.get("/", (req, res) => {
  res.send("¡Servidor HTTPS funcionando!");
});

// Lee los certificados
const options = {
  key: fs.readFileSync("certs/localhost-key.pem"),
  cert: fs.readFileSync("certs/localhost.pem"),
};

// Inicia el servidor HTTPS en un puerto alto para evitar permisos de admin
https.createServer(options, app).listen(3443, () => {
  console.log("Servidor HTTPS corriendo en https://localhost:3443");
});