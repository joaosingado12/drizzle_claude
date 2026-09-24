import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { superheroService } from "../services/superhero.service";
import {
  createSuperheroSchema,
  updateSuperheroSchema,
  idParamSchema,
} from "../types/validation";

export const superheroController = {
  list: catchAsync(async (_req: Request, res: Response) => {
    const heroes = await superheroService.list();
    res.json({ status: "success", data: heroes });
  }),

  getById: catchAsync(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const hero = await superheroService.getById(id);
    res.json({ status: "success", data: hero });
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const data = createSuperheroSchema.parse(req.body);
    const hero = await superheroService.create(data);
    res.status(201).json({ status: "success", data: hero });
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const data = updateSuperheroSchema.parse(req.body);
    const hero = await superheroService.update(id, data);
    res.json({ status: "success", data: hero });
  }),

  remove: catchAsync(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    await superheroService.remove(id);
    res.status(204).send();
  }),
};
