"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    static associate(models) {
      Appointment.belongsTo(models.student, {
        foreignKey: "studentID",
      });
      Appointment.belongsTo(models.advisor, {
        foreignKey: "advisorID",
      });
      Appointment.hasMany(models.uploadedFile, {
        foreignKey: "appointmentID",
      });
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
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      studentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "student",
          key: "id",
        },
      },
      advisorID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "advisor",
          key: "id",
        },
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("Pending", "Confirmed", "Rejected"),
        defaultValue: "Pending",
      },
    },
    {
      sequelize,
      modelName: "appointment",
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Appointment;
};
