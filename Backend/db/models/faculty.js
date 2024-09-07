"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Faculty extends Model {
    static associate(models) {
      // Define associations here
      Faculty.hasOne(models.facultyAdmin, { foreignKey: "facultyID" });
      Faculty.hasMany(models.department, { foreignKey: "facultyID" });
      Faculty.hasMany(models.programme, { foreignKey: "facultyID" });
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
      modelName: "faculty",
    }
  );

  return Faculty;
};
