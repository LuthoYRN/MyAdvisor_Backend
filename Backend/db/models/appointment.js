"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    static associate(models) {
      Appointment.belongsTo(models.student, { foreignKey: "studentID" });
      Appointment.belongsTo(models.advisor, { foreignKey: "advisorID" });
      Appointment.hasMany(models.uploadedFile, {
        foreignKey: "appointmentID",
      });
      Appointment.hasOne(models.notification, { foreignKey: "appointmentID" });
      Appointment.hasOne(models.appointmentRequest, {
        foreignKey: "appointmentID",
      });
      Appointment.hasOne(models.adviceRecord, { foreignKey: "appointmentID" });
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
          model: "student",
          key: "id",
        },
      },
      advisorID: {
        type: DataTypes.INTEGER,
        references: {
          model: "advisor",
          key: "id",
        },
      },
      date: {
        type: DataTypes.DATEONLY,
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
      modelName: "appointment",
      freezeTableName: true,
      timestamps: false, // This prevents createdAt and updatedAt fields
    }
  );
  return Appointment;
};
