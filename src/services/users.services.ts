import { UUID } from "crypto";
import userModel, { usersModelInfo } from "../db/models/Model.Users";

export class usersServices{
    static async getUserByCredentials(credentialsId:UUID) {
        try {
            const response=await userModel.findOne({where:{credentialsId}}) as Record<string,any> as usersModelInfo
            return response
        } catch (error) {
            throw error
        }
    }
}
