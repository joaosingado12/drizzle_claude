import { eq } from "drizzle-orm";
import { db } from "../db";
import { superheroes, heroPowers } from "../db/schema";
import { NotFoundError } from "../utils/AppError";
import { z } from "zod";
import { createSuperheroSchema, updateSuperheroSchema } from "../types/validation";

type CreateSuperheroInput = z.infer<typeof createSuperheroSchema>;
type UpdateSuperheroInput = z.infer<typeof updateSuperheroSchema>;

// "with" reutilizável para sempre trazer as entidades relacionadas
const heroRelations = {
  publisher: true,
  team: true,
  heroPowers: {
    with: { power: true },
  },
} as const;

/** Achata heroPowers[].power em uma lista simples "powers" na resposta da API */
function serializeHero<T extends { heroPowers: { power: unknown }[] }>(hero: T) {
  const { heroPowers: hp, ...rest } = hero;
  return { ...rest, powers: hp.map((entry) => entry.power) };
}

export const superheroService = {
  async list() {
    const heroes = await db.query.superheroes.findMany({
      with: heroRelations,
      orderBy: (h, { asc }) => [asc(h.name)],
    });
    return heroes.map(serializeHero);
  },

  async getById(id: number) {
    const hero = await db.query.superheroes.findFirst({
      where: eq(superheroes.id, id),
      with: heroRelations,
    });
    if (!hero) throw new NotFoundError("Super-herói");
    return serializeHero(hero);
  },

  async create(data: CreateSuperheroInput) {
    const { powerIds, ...heroData } = data;

    // Transação: cria o herói e já associa os poderes atomicamente
    const created = await db.transaction(async (tx) => {
      const [hero] = await tx.insert(superheroes).values(heroData).returning();

      if (powerIds && powerIds.length > 0) {
        await tx
          .insert(heroPowers)
          .values(powerIds.map((powerId) => ({ heroId: hero.id, powerId })));
      }

      return hero;
    });

    return this.getById(created.id);
  },

  async update(id: number, data: UpdateSuperheroInput) {
    const { powerIds, ...heroData } = data;

    await db.transaction(async (tx) => {
      if (Object.keys(heroData).length > 0) {
        const [updated] = await tx
          .update(superheroes)
          .set({ ...heroData, updatedAt: new Date() })
          .where(eq(superheroes.id, id))
          .returning();
        if (!updated) throw new NotFoundError("Super-herói");
      }

      // Se powerIds foi enviado, substitui completamente as associações
      if (powerIds) {
        await tx.delete(heroPowers).where(eq(heroPowers.heroId, id));
        if (powerIds.length > 0) {
          await tx
            .insert(heroPowers)
            .values(powerIds.map((powerId) => ({ heroId: id, powerId })));
        }
      }
    });

    return this.getById(id);
  },

  async remove(id: number) {
    // heroPowers é removido automaticamente via ON DELETE CASCADE
    const [deleted] = await db
      .delete(superheroes)
      .where(eq(superheroes.id, id))
      .returning();
    if (!deleted) throw new NotFoundError("Super-herói");
    return deleted;
  },
};
