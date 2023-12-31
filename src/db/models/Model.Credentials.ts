import { DataTypes } from "sequelize";
import DB from "../conf/db.conf";
import bcrypt from "bcrypt";
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
      type:DataTypes.STRING(40),
      allowNull:false
    },
    registrationDate: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
      field: "registration_date",
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
  },
  {
    updatedAt: true,
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
