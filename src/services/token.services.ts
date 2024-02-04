import { UUID } from "crypto";
import blacklist from "../db/models/Blacklist.sessions";
import { Model } from "sequelize";

class tokenServices{
    static async findSession(sessionId:UUID){
        try {
            const query=await blacklist.findByPk(sessionId)
            return [query!=null,query as Record<string,any>]
        } catch (error) {
            throw error
        }
    }
}
export default tokenServices