"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

class Faculty extends Model {
  static associate(models) {
    // Define associations here
    Faculty.hasOne(models.FacultyAdmin, { foreignKey: "facultyID" });
    Faculty.hasMany(models.Department, { foreignKey: "facultyID" });
    Faculty.hasMany(models.Programme, { foreignKey: "facultyID" });
  }
}

Faculty.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    facultyName: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: "Faculty",
  }
);

module.exports = Faculty;
