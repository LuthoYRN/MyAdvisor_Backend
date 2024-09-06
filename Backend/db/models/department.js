"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

class Department extends Model {
  static associate(models) {
    // Define associations here
    Department.hasMany(models.Major, { foreignKey: "departmentID" });
    Department.belongsTo(models.Faculty, { foreignKey: "facultyID" });
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
        model: "faculties",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Department",
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Department;
