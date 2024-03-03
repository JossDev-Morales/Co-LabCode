import { UUID } from "crypto";
import actionsModel, { actionModelInfo } from "../db/models/Model.actions";

export class actionsServices{
    static async newAction(credentialId:UUID,value:string,type:string,focus:string){
        try {
            const actionCreated=await actionsModel.create({oldValue:value,actionType:type,focus})
            return actionCreated.get('id') as UUID
        } catch (error) {
            throw error
        }
    }
    static async getAction(actionId:UUID){
        try {
            const action=await actionsModel.findByPk(actionId) as Promise<actionModelInfo>|Record<string,any>
            return action
        } catch (error) {
            throw error
        }
    }
}
