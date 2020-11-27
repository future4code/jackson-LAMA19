import { ArtistsBusiness } from "../business/ArtistsBusiness";
import { Artist } from "../model/Artist";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";
import { BaseDatabase } from "./BaseDatabase";

export class ArtistsDatabase extends BaseDatabase {
    private static TABLE_NAME: string = 'Artists';

    private static artistsBusiness = new ArtistsBusiness(
        new ArtistsDatabase(),
        new IdGenerator(),
        new Authenticator()
        );

    public async createArtist(id: string, name: string, music_genre: string, responsible: string): Promise<void> {
        try{
                await this.getConnection()
                .insert({
                    id,
                    name,
                    music_genre,
                    responsible
                }).into(ArtistsDatabase.TABLE_NAME);
            } catch(error) {
                if(error.message.match(`Duplicate entry`)){
                    throw new Error(`Essa banda ou artista já está cadastrado `)
                }
                throw new Error (error.sqlMessage || error.message)
            }
    };

    public async getArtist(id: string, name: string): Promise<Artist> {
        if(!id) {
            id = ''
        };
        if(!name) {
            name = ''
        };
        const result = await this.getConnection().raw(`
          SELECT * from ${ArtistsDatabase.TABLE_NAME} WHERE id LIKE '%${id}%' AND name LIKE '%${name}%'
        `);
        return (result[0]);
    }

};