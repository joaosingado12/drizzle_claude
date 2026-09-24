import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { powerService } from "../services/power.service";
import {
  createPowerSchema,
  updatePowerSchema,
  idParamSchema,
} from "../types/validation";

export const powerController = {
  list: catchAsync(async (_req: Request, res: Response) => {
    const powers = await powerService.list();
    res.json({ status: "success", data: powers });
  }),

  getById: catchAsync(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const power = await powerService.getById(id);
    res.json({ status: "success", data: power });
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const data = createPowerSchema.parse(req.body);
    const power = await powerService.create(data);
    res.status(201).json({ status: "success", data: power });
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const data = updatePowerSchema.parse(req.body);
    const power = await powerService.update(id, data);
    res.json({ status: "success", data: power });
  }),

  remove: catchAsync(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    await powerService.remove(id);
    res.status(204).send();
  }),
};
