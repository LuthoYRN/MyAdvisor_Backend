"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class FacultyAdmin extends Model {
    static associate(models) {
      FacultyAdmin.belongsTo(models.Faculty, { foreignKey: "facultyID" });
    }
  }

  FacultyAdmin.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
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
        validate: {
          isEmail: true,
        },
      },
      facultyID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "faculties",
          key: "id",
        },
      },
    },
    {
      sequelize,
      tableName: "facultyAdmins",
      modelName: "FacultyAdmin",
    }
  );

  return FacultyAdmin;
};
