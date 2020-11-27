import { ShowsBusiness } from "../business/ShowsBusiness";
import { Show } from "../model/Show";
import { SHOW_TIME, WEEK_DAY } from "../model/WeekDay";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";
import { BaseDatabase } from "./BaseDatabase";

export class ShowsDatabase extends BaseDatabase {
    private static TABLE_NAME: string = 'LamaShows';

    private static showsBusiness = new ShowsBusiness(
        new ShowsDatabase(),
        new IdGenerator(),
        new Authenticator()
        );

    public async createShow(id: string, week_day: WEEK_DAY, start_time: SHOW_TIME, end_time: SHOW_TIME, artist_id: string): Promise<void> {
        try{
                await this.getConnection()
                .insert({
                    id,
                    week_day,
                    start_time,
                    end_time,
                    artist_id
                }).into(ShowsDatabase.TABLE_NAME);
            } catch(error) {
                if(error.message.match(`Duplicate entry`)){
                    throw new Error(`Já existe um show dessa banda ou artista cadastrado para esse dia ou já existe um show cadastrado para esse horário`)
                }
                throw new Error (error.sqlMessage || error.message)
                
            }
    };

    public async getShows(week_day: string): Promise<Show> {
        const result = await this.getConnection().raw(`
            SELECT name, music_genre, LamaShows.start_time
            FROM Artists
            JOIN LamaShows on LamaShows.artist_id = Artists.id
            WHERE LamaShows.week_day LIKE '%${week_day}%'
            ORDER BY LamaShows.start_time ASC;
        `);
        return (result[0]);
    }

};