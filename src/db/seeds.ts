import RolesModel from "./models/Model.Roles";


export async function seeds() {
    console.log(await RolesModel.destroy({where:{}}));
    return await RolesModel.bulkCreate([{name:"Back-End"},{name:"Front-End"},{name:"Full-Stack"},{name:"AI Dev"},{name:"DevOps"},{name:"Project Manager"}])
}