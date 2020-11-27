import * as bcrypt from 'bcryptjs';

export class HashManager {

    public async hash(
        plainText: string
    ): Promise<string> {
        const cost: number = Number(process.env.BCRYPT_COST)
        const salt: string = await bcrypt.genSalt(cost)
        const cypherText: string = await bcrypt.hash(plainText, salt)
        return cypherText
    }

    public async compare(
        plainText: string,
        cypherText: string
    ): Promise<boolean> {
        return await bcrypt.compare(plainText, cypherText)
    }
}