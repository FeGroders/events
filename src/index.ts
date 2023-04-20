import cors from "cors";
import express from "express";
import serverless from "serverless-http";
import eventsRouter from "./routers/events-router";
import registrationsRouter from "./routers/registrations-router";
import usersRouter from "./routers/users-router";

// Porta do servidor
const PORT = process.env.PORT || 4000;

// Host do servidor
const HOSTNAME = process.env.HOSTNAME || "http://localhost";

// App Express
const app = express();

// JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint raiz
app.get("/", (req, res) => {
  res.send("Bem-vindo!");
});

// Cors
app.use(
  cors({
    origin: "*",
  })
);

// Rotas
const routerPrefix = "/api";
app.use(routerPrefix, eventsRouter);
app.use(routerPrefix, registrationsRouter);
app.use(routerPrefix, usersRouter);

// Resposta padrão para quaisquer outras requisições:
app.use((req, res) => {
  res.status(404);
});

// Inicia o sevidor
app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso ${HOSTNAME}:${PORT}`);
});

module.exports.handler = serverless(app);
