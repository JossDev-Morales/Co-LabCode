import { DataTypes } from "sequelize";
import DB from "../conf/db.conf";
import { Model } from "sequelize";

const blacklist = DB.define("blacklist",{
    sessionId:{
        type:DataTypes.UUID,
        primaryKey:true
    },
    CredentialsId:{
        type:DataTypes.UUID,
        allowNull:false
    },
    timestamp:{
        type:DataTypes.DATE
    }
})

export default blacklist