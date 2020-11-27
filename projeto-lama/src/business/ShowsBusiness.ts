import { ShowsDatabase } from "../data/ShowsDatabase";
import { USER_ROLES } from "../model/User";
import { SHOW_TIME, WEEK_DAY } from "../model/WeekDay";
import { Authenticator} from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

export class ShowsBusiness {

    constructor(
        private showsDatabase: ShowsDatabase,
        private idGenerator: IdGenerator,
        private authenticator: Authenticator
    ){}

    public async createShow(
        token: string,
        week_day: WEEK_DAY,
        start_time: SHOW_TIME,
        end_time: SHOW_TIME,
        artist_id: string
        ) {

        const userData = this.authenticator.getData(token);
        const id = this.idGenerator.generate();

        if (userData.role !== USER_ROLES.ADMIN) {
            throw new Error('Apenas usuários administradores podem cadastrar shows')
        }

        if (
            week_day.includes('SEXTA') && start_time.includes('SÁBADO') ||
            week_day.includes('SEXTA') && start_time.includes('DOMINGO') ||
            week_day.includes('SÁBADO') && start_time.includes('DOMINGO') ||
            week_day.includes('SÁBADO') && start_time.includes('SEXTA') ||
            week_day.includes('DOMINGO') && start_time.includes('SEXTA') ||
            week_day.includes('DOMINGO') && start_time.includes('SÁBADO') ||
            week_day.includes('SEXTA') && end_time.includes('SÁBADO') ||
            week_day.includes('SEXTA') && end_time.includes('DOMINGO') ||
            week_day.includes('SÁBADO') && end_time.includes('DOMINGO') ||
            week_day.includes('SÁBADO') && end_time.includes('SEXTA') ||
            week_day.includes('DOMINGO') && end_time.includes('SEXTA') ||
            week_day.includes('DOMINGO') && end_time.includes('SÁBADO')
            ) {
            throw new Error('Para cadastrar um horário, o formato informado deve ser: DIA - HH:MM (Ex.: SEXTA - 13:00). O DIA deve ser o mesmo informado em week_day, e os horários de começo e término devem ser entre 8:00 e 23:00')
        }

        if (start_time === end_time) {
            throw new Error('Os horários de começo e término de um show, não podem ser os mesmos, e os horários de começo e término devem ser entre 8:00 e 23:00 e não podem ser fracionados')
        }

        if (start_time > end_time) {
            throw new Error('O horário de começo de um show não pode ser anterior ao horário de término, e os horários de começo e término devem ser entre 8:00 e 23:00 e não podem ser fracionados')
        }

        await this.showsDatabase.createShow(
            id,
            week_day,
            start_time,
            end_time,
            artist_id
        );
    }

    public async getShow(
        week_day: string
    ) {
        const result = await this.showsDatabase.getShows(week_day)
        return result
    }

}