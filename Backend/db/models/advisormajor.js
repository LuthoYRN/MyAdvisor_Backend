"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AdvisorMajor extends Model {
    static associate(models) {
      // Define the relationships here
      this.belongsTo(models.advisor, {
        foreignKey: "advisorID",
        as: "advisor",
      });
      this.belongsTo(models.major, {
        foreignKey: "majorID",
        as: "major",
      });
    }
  }

  AdvisorMajor.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      advisorID: {
        type: DataTypes.INTEGER,
      },
      majorID: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "advisorMajor",
      freezeTableName: true,
    }
  );
  return AdvisorMajor;
};
