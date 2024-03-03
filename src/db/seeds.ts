import RolesModel from "./models/Model.Roles";


export async function seeds() {
    return await RolesModel.create({name:"Back-End"})
}