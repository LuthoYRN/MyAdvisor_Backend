"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    static associate(models) {
      Appointment.belongsTo(models.Student, {
        foreignKey: "studentID",
      });
      Appointment.belongsTo(models.Advisor, {
        foreignKey: "advisorID",
      });
      Appointment.hasOne(models.AdviceRecord, {
        foreignKey: "appointmentID",
      });
    }
  }

  Appointment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      studentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "students", // References the students table
          key: "id",
        },
      },
      advisorID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "advisors", // References the advisors table
          key: "id",
        },
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      comment: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      tableName: "appointments",
      modelName: "Appointment",
    }
  );

  return Appointment;
};
