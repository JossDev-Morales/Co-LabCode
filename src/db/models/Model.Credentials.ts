import { DataTypes } from "sequelize";
import DB from "../conf/db.conf";
import bcrypt from "bcrypt";
import { UUID } from "crypto";

export interface credentialModelInfo {
  id?:UUID
  mail:string
  password:string
  recoveryMail:string
  role?:string,
  failedAttempts?:number
  failedAttemptsDate?:Date
  protected:boolean
  verified:boolean
}
export interface authCredentialsInfo {
  password?:string,
  mail?:string
}
const CredentialsModel = DB.define(
  "Credentials",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4(),
    },
    mail: {
      type: DataTypes.STRING(40),
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(80),
      allowNull: false,
      set(value) {
        // El hook set se ejecuta antes de asignar el valor al atributo
        const hashedPassword = bcrypt.hashSync(String(value), 10);
        this.setDataValue("password", hashedPassword);
      },
    },
    recoveryMail:{
      type:DataTypes.STRING(40)
    },
    role: {
      type: DataTypes.ENUM,
      values: ["USER", "ADMIN", "MANAGER"],
      defaultValue: "USER",
    },
    failedAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "failed_attempts",
    },
    failedAttemptsDate: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    protected: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verified:{
      type:DataTypes.BOOLEAN,
      defaultValue:false
    }
  },
  {
    updatedAt: true,
    createdAt:"registrationDate",
    hooks: {
      beforeUpdate: async (model, options) => {
        if (model.getDataValue("password") !== model.previous("password")) {
          model.set(
            "password",
            await bcrypt.hash(model.getDataValue("password"), 10)
          );
        }
      },
    },
    tableName: "credentials",
  }
);

export default CredentialsModel;
