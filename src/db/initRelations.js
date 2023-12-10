import CredentialsModel from './models/Model.Credentials'
import userModel from './models/Model.Users'
function init() {
    CredentialsModel.hasOne(userModel,{foreignKey:'credentialsId'})
    userModel.belongsTo(CredentialsModel,{foreignKey:'credentialsId'})
}