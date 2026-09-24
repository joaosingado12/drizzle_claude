import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL não definida. Configure o arquivo .env (veja .env.example)."
  );
}

// Pool de conexões — funciona tanto localmente quanto no Neon/Render.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Instância do Drizzle com o "schema" carregado, o que habilita
// a query API relacional: db.query.superheroes.findMany({ with: { ... } })
export const db = drizzle(pool, { schema });
