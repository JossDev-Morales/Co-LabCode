import { UUID } from "crypto";
import CredentialsModel, { credentialModelInfo } from "../db/models/Model.Credentials";

export class credentialsServices{
    static async getCredentialsById(credentialsId:UUID){
        try {
            const response=CredentialsModel.findByPk(credentialsId) as Record<string,any>|Promise<credentialModelInfo>
            return response
        } catch (error) {
            throw error
        }
    }
    static async getCredentialsByMail(mail:string){
        try {
            const response = await CredentialsModel.findOne({where:{mail:mail}}) as Record<string,any>|Promise<credentialModelInfo>
            return response
        } catch (error) {
            throw error
        }
    }
}