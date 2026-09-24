import { Router } from "express";
import { superheroRouter } from "./superhero.routes";
import { publisherRouter } from "./publisher.routes";
import { teamRouter } from "./team.routes";
import { powerRouter } from "./power.routes";

export const apiRouter = Router();

apiRouter.use("/superheroes", superheroRouter);
apiRouter.use("/publishers", publisherRouter);
apiRouter.use("/teams", teamRouter);
apiRouter.use("/powers", powerRouter);
