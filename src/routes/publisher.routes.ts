import { Router } from "express";
import { publisherController } from "../controllers/publisher.controller";

export const publisherRouter = Router();

publisherRouter.get("/", publisherController.list);
publisherRouter.get("/:id", publisherController.getById);
publisherRouter.post("/", publisherController.create);
publisherRouter.put("/:id", publisherController.update);
publisherRouter.delete("/:id", publisherController.remove);
