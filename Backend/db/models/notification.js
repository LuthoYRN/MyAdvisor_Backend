"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

class Notification extends Model {
  static associate(models) {
    // Notification belongs to a Student
    Notification.belongsTo(models.Student, { foreignKey: "studentID" });

    // Notification belongs to an Appointment
    Notification.belongsTo(models.Appointment, { foreignKey: "appointmentID" });
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
      type: DataTypes.STRING,
      allowNull: true,
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
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: "Notification",
  }
);

module.exports = Notification;
