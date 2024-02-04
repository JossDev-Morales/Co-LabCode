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
  }: signinInfo) {
    try {
      const result = await DB.transaction(async (transaction) => {
        try {
          const credential = await CredentialsModel.create({
            mail,
            password,
            recoveryMail,
          });

          const user = await userModel.create({ colabname, phone, prefix });

          return {
            userId: user.get("id") as UUID,
            credentialId: credential.get("id") as UUID,
          };
        } catch (error) {
          throw new customError("UserNotCrated",(error as Error).message,400,5)
        }
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
  static async unprotect(credentialsId:UUID){
    try {
      await CredentialsModel.update({protected:false},{where:{credentialsId}})
    } catch (error) {
      throw error
    }
  }
  static async protect(credentialsId:UUID){
    try {
      await CredentialsModel.update({protected:true},{where:{credentialsId}})
    } catch (error) {
      throw error
    }
  }
}
