import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { BaseDatabase } from "../data/BaseDatabase";
import { UserDatabase } from "../data/UserDatabase";
import { Authenticator } from "../services/Authenticator";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";

export class UserController {
  
  private static userBusiness = new UserBusiness(
    new UserDatabase(),
    new IdGenerator(),
    new HashManager(),
    new Authenticator()
  );

  public async signup(req: Request, res: Response) {
    try {
      const token = await UserController.userBusiness.signUp(
        req.body.name,
        req.body.email,
        req.body.password,
        req.body.role
      );
      res.status(200).send({
          message: 'Usuário cadastrado com sucesso!',
          token
        });
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    } finally {
      BaseDatabase.destroyConnection()
  }
  }

  public async login(req: Request, res: Response) {
    const email = req.body.email;
    const password = req.body.password;
    try {
      const token = await UserController.userBusiness.login(email, password);
      res.status(200).send({
        message: 'usuário logado com sucesso!',
        token});
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    } finally {
      BaseDatabase.destroyConnection()
  }
  }
}
