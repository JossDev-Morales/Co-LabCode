import CredentialsModel from './models/Model.Credentials'
import userModel from './models/Model.Users'
import blacklist from './models/Blacklist.sessions'
export default function init() {
    CredentialsModel.hasOne(userModel,{foreignKey:'credentialsId'})
    userModel.belongsTo(CredentialsModel,{foreignKey:'credentialsId'})

    CredentialsModel.hasMany(blacklist,{foreignKey:'credentialsId'})
    blacklist.hasOne(CredentialsModel,{foreignKey:'credentialsId'})
}

