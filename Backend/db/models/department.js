"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    static associate(models) {
      // Define associations here
      Department.hasMany(models.major, { foreignKey: "departmentID" });
      Department.belongsTo(models.faculty, { foreignKey: "facultyID" });
    }
  }

  Department.init(
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
      facultyID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "faculty",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "department",
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Department;
};
