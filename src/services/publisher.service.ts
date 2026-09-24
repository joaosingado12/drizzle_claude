import { eq } from "drizzle-orm";
import { db } from "../db";
import { publishers } from "../db/schema";
import { NotFoundError } from "../utils/AppError";
import { z } from "zod";
import { createPublisherSchema, updatePublisherSchema } from "../types/validation";

type CreatePublisherInput = z.infer<typeof createPublisherSchema>;
type UpdatePublisherInput = z.infer<typeof updatePublisherSchema>;

export const publisherService = {
  async list() {
    return db.query.publishers.findMany({
      orderBy: (p, { asc }) => [asc(p.name)],
    });
  },

  async getById(id: number) {
    const publisher = await db.query.publishers.findFirst({
      where: eq(publishers.id, id),
      with: { heroes: true }, // inclui os heróis relacionados
    });
    if (!publisher) throw new NotFoundError("Editora");
    return publisher;
  },

  async create(data: CreatePublisherInput) {
    const [created] = await db.insert(publishers).values(data).returning();
    return created;
  },

  async update(id: number, data: UpdatePublisherInput) {
    const [updated] = await db
      .update(publishers)
      .set(data)
      .where(eq(publishers.id, id))
      .returning();
    if (!updated) throw new NotFoundError("Editora");
    return updated;
  },

  async remove(id: number) {
    const [deleted] = await db
      .delete(publishers)
      .where(eq(publishers.id, id))
      .returning();
    if (!deleted) throw new NotFoundError("Editora");
    return deleted;
  },
};
