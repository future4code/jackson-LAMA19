import { UserDatabase } from "../data/UserDatabase";
import { USER_ROLES } from "../model/User";
import { Authenticator } from "../services/Authenticator";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";

export class UserBusiness {

    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private hashManager: HashManager ,
        private authenticator: Authenticator
    ){}

    public async signUp(
        name: string,
        email: string,
        password: string,
        role: USER_ROLES
        ) {

        if (!name || !email || !password) {
            throw new Error('Insira todas as informações necessárias para o cadastro')
        }
        
        if (email.indexOf('@') === -1) {
            throw new Error('E-mail inválido')
        }
        
        if (password.length < 6) {
            throw new Error("Senha inválida");
        }
        
        if (!password.match('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8})$')) {
            throw new Error("Senha deve ter no mínimo 8 caracteres, e conter uma letra maiúscula e uma minúscula");
        }

        const id = this.idGenerator.generate();

        const cypherPassword = await this.hashManager.hash(password);

        await this.userDatabase.createUser(
            id, name, email, cypherPassword, role
        );

        const token = this.authenticator.generateToken({
            id,
            role
        });

        return token;
    }

    public async login(email: string, password: string): Promise<string> {

        if (!email || !password || email.indexOf("@") === -1) {
            throw new Error('Insira todas as informações necessárias para o login')
        }

        const user = await this.userDatabase.getUserByEmail(email);

        const passwordIsCorrect: boolean = await new HashManager().compare(
            password,
            user.password
        );

        if (!passwordIsCorrect) {
            throw new Error('Usuário ou senha inválidos')
        }

        const token = this.authenticator.generateToken({id: user.id, role: user.role });

        return token;
    }

}