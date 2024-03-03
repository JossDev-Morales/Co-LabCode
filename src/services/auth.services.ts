import { UUID } from "crypto";
import { signinInfo } from "../controlllers/auth.controller";
import DB from "../db/conf/db.conf";
import CredentialsModel, {
  credentialModelInfo,
} from "../db/models/Model.Credentials";
import userModel from "../db/models/Model.Users";
import customError from "../tools/error";

export class authServices {
  static async signUpService({
    colabname,
    mail,
    password,
    phone,
    prefix,
    recoveryMail,
    role
  }: signinInfo) {
    try {
      const result = await DB.transaction(async (transaction) => {
        
        const credential = await CredentialsModel.create({
          mail,
          password,
          recoveryMail,
        });

        const user = await userModel.create({ colabname, phoneNumber:phone, phonePrefix:prefix,mainrolColab:role,credentialsId:credential.get("id") });
        await transaction.commit()
        return {
          userId: user.get("id") as UUID,
          credentialId: credential.get("id") as UUID,
        };
      });
      return result;
    } catch (error) {
      throw new customError("UserNotCrated",(error as Error).message,400,5)
    }
  }
  
}