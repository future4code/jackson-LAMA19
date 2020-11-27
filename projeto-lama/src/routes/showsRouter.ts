import express from 'express'
import { ShowsController } from '../controller/ShowsController';

export const showsRouter = express.Router()

showsRouter.post("/addshow", new ShowsController().createShow);
showsRouter.get("/search", new ShowsController().getShow);