"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Availability extends Model {
    static associate(models) {
      // Define association here
      Availability.belongsTo(models.Advisor, {
        foreignKey: "advisorID",
      });
    }
  }

  Availability.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      advisorID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "advisors",
          key: "id",
        },
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "availability",
      modelName: "Availability",
    }
  );

  return Availability;
};
