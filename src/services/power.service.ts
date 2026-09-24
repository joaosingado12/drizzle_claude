import { eq } from "drizzle-orm";
import { db } from "../db";
import { powers } from "../db/schema";
import { NotFoundError } from "../utils/AppError";
import { z } from "zod";
import { createPowerSchema, updatePowerSchema } from "../types/validation";

type CreatePowerInput = z.infer<typeof createPowerSchema>;
type UpdatePowerInput = z.infer<typeof updatePowerSchema>;

export const powerService = {
  async list() {
    return db.query.powers.findMany({
      orderBy: (p, { asc }) => [asc(p.name)],
    });
  },

  async getById(id: number) {
    const power = await db.query.powers.findFirst({
      where: eq(powers.id, id),
    });
    if (!power) throw new NotFoundError("Poder");
    return power;
  },

  async create(data: CreatePowerInput) {
    const [created] = await db.insert(powers).values(data).returning();
    return created;
  },

  async update(id: number, data: UpdatePowerInput) {
    const [updated] = await db
      .update(powers)
      .set(data)
      .where(eq(powers.id, id))
      .returning();
    if (!updated) throw new NotFoundError("Poder");
    return updated;
  },

  async remove(id: number) {
    const [deleted] = await db.delete(powers).where(eq(powers.id, id)).returning();
    if (!deleted) throw new NotFoundError("Poder");
    return deleted;
  },
};
