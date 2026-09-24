import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { apiRouter } from "./routes";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Health check — útil para o Render monitorar se o serviço está no ar
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/", (_req, res) => {
  res.json({
    message: "API de Super-Heróis com Drizzle ORM 🦸",
    docs: "/api/superheroes, /api/publishers, /api/teams, /api/powers",
  });
});

app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);
