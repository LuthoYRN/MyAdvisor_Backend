"use strict";
const { Model, Sequelize } = require("sequelize");

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
        type: "TIMESTAMP WITHOUT TIME ZONE",
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
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
