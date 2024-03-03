import CredentialsModel from './models/Model.Credentials'
import userModel from './models/Model.Users'
import blacklist from './models/Blacklist.sessions'
import RolesModel from './models/Model.Roles'

export default function init() {
    userModel.hasOne(CredentialsModel,{foreignKey:'credentialsId'})
    CredentialsModel.belongsTo(userModel,{foreignKey:'credentialsId'})

    userModel.belongsTo(RolesModel,{foreignKey:'mainrolColab'})
    RolesModel.hasMany(userModel,{foreignKey:'mainrolColab'})
}

