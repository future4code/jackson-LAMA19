import { User, USER_ROLES } from "../model/User";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
    private static TABLE_NAME: string = 'LamaUsers';

    public async createUser(id: string, name: string, email: string, password: string, role: USER_ROLES): Promise<void> {
        try{
                await this.getConnection()
                .insert({
                    id,
                    name,
                    email,
                    password,
                    role
                }).into(UserDatabase.TABLE_NAME);
            } catch(error) {
                if(error.message.includes("Data truncated for column 'role' at row 1")) {
                    throw new Error("Roles precisam ser necessariamente NORMAL ou ADMIN")
                }

                if(error.message.includes(`for key 'email'`)) {
                        throw new Error("O email informado já consta com um usuário cadastrado")
                }
                
                throw new Error (error.sqlMessage || error.message)
            }
    };

    public async getUserByEmail(email: string): Promise<User> {
        try {
            const result = await this.getConnection()
            .select('*')
            .from(UserDatabase.TABLE_NAME)
            .where({email})
            return result[0]
        } catch(error) {
            throw new Error (error.sqlMessage || error.message)
        }
    };
}; 