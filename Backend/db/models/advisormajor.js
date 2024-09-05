"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

class AdvisorMajor extends Model {
  static associate(models) {
    // Define the relationships here
    this.belongsTo(models.Advisor, {
      foreignKey: "advisorID",
      as: "advisor",
    });
    this.belongsTo(models.Major, {
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
    modelName: "AdvisorMajor",
    tableName: "advisorMajor",
  }
);

module.exports = AdvisorMajor;
