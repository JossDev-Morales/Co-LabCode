import { Op } from "sequelize";
import RolesModel from "../db/models/Model.Roles";

export class rolesServices {
    static async getRolesByQuery(q:string){
        try {
            return await RolesModel.findAll({
                where:{
                    name:{
                        [Op.like]:`%${q}%`
                    }
                }
            })
        } catch (error) {
            throw error
        }
    } 
    static async getAllRoles(){
        try {
            return await RolesModel.findAll()
        } catch (error) {
            throw error
        }
    }
}

