"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Faculty extends Model {
    static associate(models) {
      Faculty.hasOne(models.FacultyAdmin, { foreignKey: "facultyID" });
    }
  }

  Faculty.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      facultyName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "faculties",
      modelName: "Faculty",
    }
  );

  return Faculty;
};
