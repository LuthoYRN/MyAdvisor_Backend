"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AppointmentRequest extends Model {
    static associate(models) {
      // Associations can be defined here
      AppointmentRequest.belongsTo(models.appointment, {
        foreignKey: "appointmentID",
      });
      AppointmentRequest.belongsTo(models.availability, {
        foreignKey: "availabilityID",
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
      },
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      availabilityID: {
        type: DataTypes.INTEGER,
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      timestamps: false,
      freezeTableName: true,
      modelName: "appointmentRequest",
    }
  );

  return AppointmentRequest;
};
