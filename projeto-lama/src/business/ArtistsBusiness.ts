import { ArtistsDatabase } from "../data/ArtistsDatabase";
import { USER_ROLES } from "../model/User";
import { Authenticator} from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

export class ArtistsBusiness {

    constructor(
        private artistsDatabase: ArtistsDatabase,
        private idGenerator: IdGenerator,
        private authenticator: Authenticator
    ){}

    public async createArtist(
        token: string,
        name: string,
        music_genre: string,
        responsible: string
        ) {

        const userData = this.authenticator.getData(token);
        const id = this.idGenerator.generate();

        if (!name || !music_genre || !responsible) {
            throw new Error('Insira todas as informações necessárias para o cadastro')
        }

        if (userData.role !== USER_ROLES.ADMIN) {
            throw new Error('Apenas usuários administradores podem cadastrar bandas')
        }

        await this.artistsDatabase.createArtist(
            id,
            name,
            music_genre,
            responsible
        );
    }

    public async getArtist(
        id: string,
        name: string
    ) {
        const result = await this.artistsDatabase.getArtist(id, name)
        return result
    }

}