import { Router } from "express";
import { powerController } from "../controllers/power.controller";

export const powerRouter = Router();

powerRouter.get("/", powerController.list);
powerRouter.get("/:id", powerController.getById);
powerRouter.post("/", powerController.create);
powerRouter.put("/:id", powerController.update);
powerRouter.delete("/:id", powerController.remove);
