import { Router } from "express";
import { teamController } from "../controllers/team.controller";

export const teamRouter = Router();

teamRouter.get("/", teamController.list);
teamRouter.get("/:id", teamController.getById);
teamRouter.post("/", teamController.create);
teamRouter.put("/:id", teamController.update);
teamRouter.delete("/:id", teamController.remove);
