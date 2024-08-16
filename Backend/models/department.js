"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    static associate(models) {
      Department.hasMany(models.Advisor, { foreignKey: "departmentID" });
      Department.hasMany(models.Major, { foreignKey: "departmentID" });
      Department.belongsTo(models.Faculty, { foreignKey: "facultyID" });
    }
  }

  Department.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
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
      tableName: "departments",
      modelName: "Department",
    }
  );

  return Department;
};
