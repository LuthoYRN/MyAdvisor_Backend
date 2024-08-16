"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class StudentMajor extends Model {
    static associate(models) {
      // define association here
      StudentMajor.belongsTo(models.Student, { foreignKey: "studentID" });
      StudentMajor.belongsTo(models.Major, { foreignKey: "majorID" });
    }
  }

  StudentMajor.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      studentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "students",
          key: "id",
        },
      },
      majorID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "majors",
          key: "id",
        },
      },
    },
    {
      sequelize,
      tableName: "students_majors",
      modelName: "StudentMajor",
    }
  );

  return StudentMajor;
};
