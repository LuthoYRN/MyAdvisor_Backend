"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

class FacultyAdmin extends Model {
  static associate(models) {
    FacultyAdmin.belongsTo(models.Faculty, { foreignKey: "facultyID" });
  }
}

FacultyAdmin.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    facultyID: {
      type: DataTypes.INTEGER,
      references: {
        model: "faculty",
        key: "id",
      },
    },
    profile_url: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "facultyAdmin",
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = FacultyAdmin;
