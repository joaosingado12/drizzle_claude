import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { publisherService } from "../services/publisher.service";
import {
  createPublisherSchema,
  updatePublisherSchema,
  idParamSchema,
} from "../types/validation";

export const publisherController = {
  list: catchAsync(async (_req: Request, res: Response) => {
    const publishers = await publisherService.list();
    res.json({ status: "success", data: publishers });
  }),

  getById: catchAsync(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const publisher = await publisherService.getById(id);
    res.json({ status: "success", data: publisher });
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const data = createPublisherSchema.parse(req.body);
    const publisher = await publisherService.create(data);
    res.status(201).json({ status: "success", data: publisher });
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const data = updatePublisherSchema.parse(req.body);
    const publisher = await publisherService.update(id, data);
    res.json({ status: "success", data: publisher });
  }),

  remove: catchAsync(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    await publisherService.remove(id);
    res.status(204).send();
  }),
};
