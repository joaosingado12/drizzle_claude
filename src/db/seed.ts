import "dotenv/config";
import { db, pool } from "./index";
import { publishers, teams, powers, superheroes, heroPowers } from "./schema";

/**
 * Popula o banco com dados de exemplo.
 * Rodar com: npm run db:seed
 * Idempotente-ish: limpa as tabelas antes de inserir (ambiente de estudo/dev).
 */
async function seed() {
  console.log("🌱 Iniciando seed...");

  // Ordem importa por causa das foreign keys
  await db.delete(heroPowers);
  await db.delete(superheroes);
  await db.delete(powers);
  await db.delete(teams);
  await db.delete(publishers);

  const [marvel, dc] = await db
    .insert(publishers)
    .values([
      { name: "Marvel Comics", foundedYear: 1939 },
      { name: "DC Comics", foundedYear: 1934 },
    ])
    .returning();

  const [avengers, justiceLeague] = await db
    .insert(teams)
    .values([
      { name: "Vingadores", description: "Os heróis mais poderosos da Terra" },
      { name: "Liga da Justiça", description: "União dos maiores heróis da DC" },
    ])
    .returning();

  const [forca, voo, teiaOrganica, velocidade, telepatia] = await db
    .insert(powers)
    .values([
      { name: "Força sobre-humana", description: "Força muito acima da humana" },
      { name: "Voo", description: "Capacidade de voar" },
      { name: "Teia orgânica", description: "Produz e lança teias" },
      { name: "Super velocidade", description: "Velocidade extrema" },
      { name: "Telepatia", description: "Lê e influencia mentes" },
    ])
    .returning();

  const [ironMan, spiderMan, superman, flash] = await db
    .insert(superheroes)
    .values([
      {
        name: "Tony Stark",
        alias: "Homem de Ferro",
        powerLevel: 85,
        publisherId: marvel.id,
        teamId: avengers.id,
      },
      {
        name: "Peter Parker",
        alias: "Homem-Aranha",
        powerLevel: 78,
        publisherId: marvel.id,
        teamId: avengers.id,
      },
      {
        name: "Clark Kent",
        alias: "Superman",
        powerLevel: 99,
        publisherId: dc.id,
        teamId: justiceLeague.id,
      },
      {
        name: "Barry Allen",
        alias: "Flash",
        powerLevel: 90,
        publisherId: dc.id,
        teamId: justiceLeague.id,
      },
    ])
    .returning();

  await db.insert(heroPowers).values([
    { heroId: ironMan.id, powerId: forca.id },
    { heroId: ironMan.id, powerId: voo.id },
    { heroId: spiderMan.id, powerId: forca.id },
    { heroId: spiderMan.id, powerId: teiaOrganica.id },
    { heroId: superman.id, powerId: forca.id },
    { heroId: superman.id, powerId: voo.id },
    { heroId: superman.id, powerId: telepatia.id },
    { heroId: flash.id, powerId: velocidade.id },
  ]);

  console.log("✅ Seed concluído com sucesso!");
  await pool.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Erro no seed:", err);
  process.exit(1);
});
