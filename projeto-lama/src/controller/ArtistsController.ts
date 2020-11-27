import { Request, Response } from "express";
import { ArtistsBusiness } from "../business/ArtistsBusiness";
import { ArtistsDatabase } from "../data/ArtistsDatabase";
import { BaseDatabase } from "../data/BaseDatabase";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

export class ArtistsController {

    private static artistsBusiness = new ArtistsBusiness(
    new ArtistsDatabase(),
    new IdGenerator(),
    new Authenticator()
    );

    public async createUser(req: Request, res: Response) {
        try {
            await ArtistsController.artistsBusiness.createArtist(
            req.headers.authorization as string,
            req.body.name,
            req.body.music_genre,
            req.body.responsible
            );
            res.status(200).send({
                message: 'Banda cadastrada com sucesso!',
            });
        } catch (err) {
            res.status(err.errorCode || 400).send({
                message: err.message });
        } finally {
            BaseDatabase.destroyConnection()
        }
    }

    public async getArtist(req: Request, res: Response) {
        try {
            const artist = await ArtistsController.artistsBusiness.getArtist(
                req.query.id as string,
                req.query.name as string
            );
            res.status(200).send({
                artist
            })
        } catch (error) {
            
        } finally {
            BaseDatabase.destroyConnection()
        }
    }
}