"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class StudentMajor extends Model {
    static associate(models) {
      // Associate with Student
      StudentMajor.belongsTo(models.Student, {
        foreignKey: "studentID",
        as: "student",
      });

      // Associate with Major
      StudentMajor.belongsTo(models.Major, {
        foreignKey: "majorID",
        as: "major",
      });
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
          model: "student",
          key: "id",
        },
      },
      majorID: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "major",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "studentsMajor",
      freezeTableName: true,
      timestamps: false,
    }
  );

  return StudentMajor;
};
