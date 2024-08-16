"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AdvisorMajor extends Model {
    static associate(models) {
      AdvisorMajor.belongsTo(models.Advisor, { foreignKey: "advisorID" });
      AdvisorMajor.belongsTo(models.Major, { foreignKey: "majorID" });
    }
  }
  AdvisorMajor.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      advisorID: {
        type: DataTypes.INTEGER,
        references: {
          model: "advisors",
          key: "id",
        },
      },
      majorID: {
        type: DataTypes.INTEGER,
        references: {
          model: "majors",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "AdvisorMajor",
      tableName: "advisors_majors",
    }
  );
  return AdvisorMajor;
};
