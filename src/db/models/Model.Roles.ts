import { DataTypes } from "sequelize";
import DB from "../conf/db.conf";

const RolesModel=DB.define("roles",{
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4(),
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING(30)
    }
},
{timestamps:false})
export default RolesModel