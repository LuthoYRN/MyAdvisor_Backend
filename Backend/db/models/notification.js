"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      // Notification belongs to a Student
      Notification.belongsTo(models.student, { foreignKey: "studentID" });

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
        validate: {
          isIn: [["approval", "rejection"]],
        },
        type: DataTypes.STRING,
        allowNull: false,
      },
      appointmentID: {
        type: DataTypes.INTEGER,
        allowNull: true, // Could be null if not related to an appointment
      },
      studentID: {
        type: DataTypes.INTEGER,
        allowNull: false, // Every notification is tied to a student
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
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
      modelName: "notification",
    }
  );

  return Notification;
};
