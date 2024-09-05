"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

class Appointment extends Model {
  static associate(models) {
    Appointment.belongsTo(models.Student, { foreignKey: "studentID" });
    Appointment.belongsTo(models.Advisor, { foreignKey: "advisorID" });
    Appointment.hasMany(models.UploadedFiles, { foreignKey: "appointmentID" });
    Appointment.hasOne(models.Notification, { foreignKey: "appointmentID" });
    Appointment.hasOne(models.AppointmentRequest, {
      foreignKey: "appointmentID",
    });
    Appointment.hasOne(models.AdviceRecord, { foreignKey: "appointmentID" });
  }
}

Appointment.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    studentID: {
      type: DataTypes.INTEGER,
      references: {
        model: "students",
        key: "id",
      },
    },
    advisorID: {
      type: DataTypes.INTEGER,
      references: {
        model: "advisors",
        key: "id",
      },
    },
    date: {
      type: DataTypes.DATE,
    },
    time: {
      type: DataTypes.TIME,
    },
    comment: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "Appointment",
    freezeTableName: true,
    timestamps: false, // This prevents createdAt and updatedAt fields
  }
);

module.exports = Appointment;
