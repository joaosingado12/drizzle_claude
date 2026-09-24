import { Router } from "express";
import { superheroController } from "../controllers/superhero.controller";

export const superheroRouter = Router();

superheroRouter.get("/", superheroController.list);
superheroRouter.get("/:id", superheroController.getById);
superheroRouter.post("/", superheroController.create);
superheroRouter.put("/:id", superheroController.update);
superheroRouter.delete("/:id", superheroController.remove);
