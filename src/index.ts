import cors from "cors";
import express from "express";
import serverless from "serverless-http";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import eventsRouter from "./routers/events-router";
import registrationsRouter from "./routers/registrations-router";
import usersRouter from "./routers/users-router";
import certificatesRouter from "./routers/certificates-router";

// Porta do servidor
const PORT = process.env.PORT || 4000;

// Host do servidor
const HOSTNAME = process.env.HOSTNAME || "http://localhost";

const options = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "REST API for Swagger Documentation",
      version: "1.0.0",
    },
    schemes: ["http", "https"],
    servers: [{ url: "http://localhost:4000/api" }],
  },
  apis: [
    "./src/routers/events-router.ts",
    "./src/routers/registrations-router.ts",
    "./src/routers/users-router.ts",
    "./src/routers/certificates-router.ts",
  ],
};

// App Express
const app = express();

const swaggerSpec = swaggerJsDoc(options);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
app.use(routerPrefix, certificatesRouter);

// Resposta padrão para quaisquer outras requisições:
app.use((req, res) => {
  res.status(404);
});

// Inicia o sevidor
app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso ${HOSTNAME}:${PORT}`);
});

module.exports.handler = serverless(app);
