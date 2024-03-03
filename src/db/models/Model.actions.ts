import { DataTypes } from "sequelize";
import DB from "../conf/db.conf";
import { UUID } from "crypto";
export interface actionModelInfo {
    id:UUID
    oldValue:string
    actionType:'CREDENTIALS'
    focus:'MAIL'|'PASSWORD'|'RECOVERYMAIL'
}
const actionsModel=DB.define("actions",{
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4(),
        primaryKey:true
    },
    oldValue:{
        type:DataTypes.STRING,
        allowNull:false      
    },
    actionType:{
        type:DataTypes.ENUM,
        values:['CREDENTIALS'],
        allowNull:false
    },
    focus:{
        type:DataTypes.ENUM,
        values:['MAIL','PASSWORD','RECOVERYMAIL']
    }
})

export default actionsModel