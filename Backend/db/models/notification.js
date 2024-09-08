"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      // Notification belongs to an Appointment
      Notification.belongsTo(models.appointment, {
        foreignKey: "appointmentID",
      });
    }
  }
  Notification.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      type: {
        type: DataTypes.ENUM("Approval", "Rejection"),
        allowNull: false,
      },
      appointmentID: {
        type: DataTypes.INTEGER,
        references: {
          model: "appointment",
          key: "id",
        },
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "notification",
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Notification;
};
