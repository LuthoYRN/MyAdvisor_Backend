"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AppointmentRequest extends Model {
    static associate(models) {
      AppointmentRequest.belongsTo(models.appointment, {
        foreignKey: "appointmentID",
      });
    }
  }

  AppointmentRequest.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      appointmentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "appointment",
          key: "id",
        },
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "appointmentRequest",
      timestamps: false,
      freezeTableName: true,
    }
  );

  return AppointmentRequest;
};
