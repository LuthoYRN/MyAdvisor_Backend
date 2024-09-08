"use strict";
const { Model, Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AdviceLog extends Model {
    static associate(models) {
      // Define association with Appointments model
      AdviceLog.belongsTo(models.appointment, {
        foreignKey: "appointmentID",
        targetKey: "id",
      });
    }
  }
  AdviceLog.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      appointmentID: {
        type: DataTypes.INTEGER,
        references: {
          model: "appointment",
          key: "id",
        },
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: "TIMESTAMP WITHOUT TIME ZONE",
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      sequelize,
      modelName: "adviceLog",
      timestamps: false,
      freezeTableName: true,
    }
  );

  return AdviceLog;
};
