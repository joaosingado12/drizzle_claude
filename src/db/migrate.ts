import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { Pool } from "@neondatabase/serverless";

/**
 * Script standalone que aplica as migrations pendentes.
 * Usado localmente (npm run db:migrate) e também pode ser chamado
 * como parte do build/deploy no Render.
 */
async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL não definida.");
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  console.log("🚀 Aplicando migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✅ Migrations aplicadas com sucesso.");

  await pool.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erro ao aplicar migrations:", err);
  process.exit(1);
});
