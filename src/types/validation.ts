import { z } from "zod";

/* ---------------------- Publishers ---------------------- */
export const createPublisherSchema = z.object({
  name: z.string().min(2).max(100),
  foundedYear: z.number().int().min(1800).max(2100).optional(),
});
export const updatePublisherSchema = createPublisherSchema.partial();

/* ------------------------ Teams -------------------------- */
export const createTeamSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(1000).optional(),
});
export const updateTeamSchema = createTeamSchema.partial();

/* ------------------------ Powers -------------------------- */
export const createPowerSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(1000).optional(),
});
export const updatePowerSchema = createPowerSchema.partial();

/* ---------------------- Superheroes ------------------------ */
export const createSuperheroSchema = z.object({
  name: z.string().min(2).max(100),
  alias: z.string().min(2).max(100),
  powerLevel: z.number().int().min(1).max(100).default(1),
  publisherId: z.number().int().positive().optional().nullable(),
  teamId: z.number().int().positive().optional().nullable(),
  powerIds: z.array(z.number().int().positive()).optional(), // poderes a associar
});
export const updateSuperheroSchema = createSuperheroSchema.partial();

/* Params genéricos de rota (:id) */
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
