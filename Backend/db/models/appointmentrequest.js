"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

class AppointmentRequest extends Model {
  static associate(models) {
    // Associations can be defined here
    AppointmentRequest.belongsTo(models.Appointment, {
      foreignKey: "appointmentID",
    });
    AppointmentRequest.belongsTo(models.Availability, {
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

module.exports = AppointmentRequest;
