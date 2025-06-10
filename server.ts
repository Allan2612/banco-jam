import express from "express";
import next from "next";
import https from "https";
import fs from "fs";
import path from "path";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, "certs/localhost-key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "certs/localhost.pem")),
};

app.prepare().then(() => {
  const server = express();

  // Maneja todas las rutas con Next.js
  server.use((req, res) => {
  return handle(req, res);
});

  https.createServer(httpsOptions, server).listen(3443, () => {
    console.log("Servidor Next.js + API corriendo en https://localhost:3443");
  });
});