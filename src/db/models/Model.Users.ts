import { DataTypes } from "sequelize";
import DB from "../conf/db.conf";
import { UUID } from "crypto";
import CredentialsModel from "./Model.Credentials";
import RolesModel from "./Model.Roles";

export interface usersModelInfo{
  id:UUID
  credentialsId:UUID
  colabname:string
  name:string
  lastname:string
  userImage:UUID
  linkedin:string
  github:string
  portfolio:string
  description:string
  mainroleColab:UUID
  rolesColab:Array<string>
  phoneNumber:string
  phonePrefix:string
  stars:number
  followers:number
  follows:number
  opendesProjects:number
  currentColabs:number
  isPremium:boolean
  devSeniority:[
    "Newbie",
    "Semi Junior",
    "Junior",
    "Semi Senior",
    "Senior",
    "architect",
  ]
  resume:UUID
  mkProfile:UUID
  mkStyles:Record<string,any>
  posts:number
  configs:Record<string,any>
}
const userModel = DB.define(
  "Users",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4(),
      primaryKey: true,
    },
    credentialsId:{
      type:DataTypes.UUID,
      field:"credentials_id",
      references:{
        model:CredentialsModel,
        key:'id'
      }
    },    
    colabname: {
      type: DataTypes.STRING(30),
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(30),
    },
    lastname: {
      type: DataTypes.STRING(30),
    },
    userImage: {
      type: DataTypes.UUID,
      field:'user_image'
    },
    linkedin: {
      type: DataTypes.STRING(30),
    },
    github: {
      type: DataTypes.STRING(30),
    },
    portfolio: {
      type: DataTypes.STRING(50),
    },
    description: {
      type: DataTypes.STRING(200),
    },
    mainrolColab: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "mainrol_colab",
      references:{
        model:RolesModel,
        key:'id'
      }
    },
    rolesColab: {
      type: DataTypes.ARRAY(DataTypes.STRING(30)),
      field: "roles_colab",
    },
    phoneNumber: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: "phone_number",
    },
    phonePrefix: {
      type: DataTypes.STRING(3),
      allowNull: false,
      field: "phone_prefix",
    },
    stars: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    followers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    follows: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    openedProjects: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "opened_projects",
    },
    currentColabs: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "current_colabs",
    },
    isPremium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_premium",
    },
    devSeniority: {
      type: DataTypes.ENUM,
      values: [
        "Newbie",
        "Semi Junior",
        "Junior",
        "Semi Senior",
        "Senior",
        "architect",
      ],
      field: "dev_seniority",
      defaultValue: "Newbie",
    },
    resume: {
      type: DataTypes.UUID,
    },
    mkProfile: {
      type: DataTypes.UUID,
    },
    mkStyles: {
      type: DataTypes.JSON,
    },
    posts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    configs: {
      type: DataTypes.JSONB,
    },
  },
  {
    timestamps: true,
    tableName:"usersinfo"
  }
);
export default userModel
