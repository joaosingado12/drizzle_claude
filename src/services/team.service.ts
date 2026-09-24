import { eq } from "drizzle-orm";
import { db } from "../db";
import { teams } from "../db/schema";
import { NotFoundError } from "../utils/AppError";
import { z } from "zod";
import { createTeamSchema, updateTeamSchema } from "../types/validation";

type CreateTeamInput = z.infer<typeof createTeamSchema>;
type UpdateTeamInput = z.infer<typeof updateTeamSchema>;

export const teamService = {
  async list() {
    return db.query.teams.findMany({
      orderBy: (t, { asc }) => [asc(t.name)],
    });
  },

  async getById(id: number) {
    const team = await db.query.teams.findFirst({
      where: eq(teams.id, id),
      with: { heroes: true },
    });
    if (!team) throw new NotFoundError("Equipe");
    return team;
  },

  async create(data: CreateTeamInput) {
    const [created] = await db.insert(teams).values(data).returning();
    return created;
  },

  async update(id: number, data: UpdateTeamInput) {
    const [updated] = await db
      .update(teams)
      .set(data)
      .where(eq(teams.id, id))
      .returning();
    if (!updated) throw new NotFoundError("Equipe");
    return updated;
  },

  async remove(id: number) {
    const [deleted] = await db.delete(teams).where(eq(teams.id, id)).returning();
    if (!deleted) throw new NotFoundError("Equipe");
    return deleted;
  },
};
