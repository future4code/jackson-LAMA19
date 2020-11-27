import { Request, Response } from "express";
import { ShowsBusiness } from "../business/ShowsBusiness";
import { BaseDatabase } from "../data/BaseDatabase";
import { ShowsDatabase } from "../data/ShowsDatabase";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

export class ShowsController {

    private static showsBusiness = new ShowsBusiness(
    new ShowsDatabase(),
    new IdGenerator(),
    new Authenticator()
    );

    public async createShow(req: Request, res: Response) {
        try {
            await ShowsController.showsBusiness.createShow(
            req.headers.authorization as string,
            req.body.week_day,
            req.body.start_time,
            req.body.end_time,
            req.body.artist_id
            );
            res.status(200).send({
                message: 'Show cadastrado com sucesso!',
            });
        } catch (error) {
            res.status(error.errorCode || 400).send({
                message: error.message });
        } finally {
            BaseDatabase.destroyConnection()
        }
    }

    public async getShow(req: Request, res: Response) {
        try {
            const shows = await ShowsController.showsBusiness.getShow(
                req.query.week_day as string
            );
            res.status(200).send({
                shows
            })
        } catch (error) {
            res.status(error.errorCode || 400).send({
                message: error.message });
        } finally {
            BaseDatabase.destroyConnection()
        }
    }
}