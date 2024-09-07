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
        allowNull:false,
        type: DataTypes.INTEGER,
      },
      read: {
        allowNull:false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      availabilityID: {
        allowNull:false,
        type: DataTypes.INTEGER,
      },
      timestamp: {
        allowNull:false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      uuid: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
