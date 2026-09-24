import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { teamService } from "../services/team.service";
import {
  createTeamSchema,
  updateTeamSchema,
  idParamSchema,
} from "../types/validation";

export const teamController = {
  list: catchAsync(async (_req: Request, res: Response) => {
    const teams = await teamService.list();
    res.json({ status: "success", data: teams });
  }),

  getById: catchAsync(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const team = await teamService.getById(id);
    res.json({ status: "success", data: team });
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const data = createTeamSchema.parse(req.body);
    const team = await teamService.create(data);
    res.status(201).json({ status: "success", data: team });
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const data = updateTeamSchema.parse(req.body);
    const team = await teamService.update(id, data);
    res.json({ status: "success", data: team });
  }),

  remove: catchAsync(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    await teamService.remove(id);
    res.status(204).send();
  }),
};
