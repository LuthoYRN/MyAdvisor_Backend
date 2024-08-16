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

    // Static method to find appointments by student ID
    static async findByStudent(studentID) {
      try {
        return await Appointment.findAll({
          where: { studentID },
          include: [sequelize.models.Advisor, sequelize.models.AdviceRecord],
        });
      } catch (error) {
        throw new Error(
          "Error finding appointments by student: " + error.message
        );
      }
    }

    // Static method to find appointments by advisor ID
    static async findByAdvisor(advisorID) {
      try {
        return await Appointment.findAll({
          where: { advisorID },
          include: [sequelize.models.Student, sequelize.models.AdviceRecord],
        });
      } catch (error) {
        throw new Error(
          "Error finding appointments by advisor: " + error.message
        );
      }
    }

    // Static method to create a new appointment
    static async createAppointment(data) {
      try {
        return await Appointment.create(data);
      } catch (error) {
        throw new Error("Error creating appointment: " + error.message);
      }
    }

    // Static method to find appointments by date
    static async findByDate(date) {
      try {
        return await Appointment.findAll({
          where: { date },
          include: [sequelize.models.Student, sequelize.models.Advisor],
        });
      } catch (error) {
        throw new Error("Error finding appointments by date: " + error.message);
      }
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
          model: "students",
          key: "id",
        },
        set(value) {
          if (isNaN(value)) {
            throw new Error("Invalid studentID");
          }
          this.setDataValue("studentID", value);
        },
      },
      advisorID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "advisors",
          key: "id",
        },
        set(value) {
          if (isNaN(value)) {
            throw new Error("Invalid advisorID");
          }
          this.setDataValue("advisorID", value);
        },
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        set(value) {
          const dateValue = new Date(value);
          if (isNaN(dateValue.getTime())) {
            throw new Error("Invalid date");
          }
          this.setDataValue("date", dateValue);
        },
        get() {
          const rawValue = this.getDataValue("date");
          return rawValue ? rawValue.toLocaleDateString() : null;
        },
      },
      time: {
        type: DataTypes.TIME,
        allowNull: false,
        set(value) {
          if (!/^\d{2}:\d{2}(:\d{2})?$/.test(value)) {
            throw new Error("Invalid time format");
          }
          this.setDataValue("time", value);
        },
      },
      comment: {
        type: DataTypes.STRING,
        set(value) {
          this.setDataValue("comment", value ? value.trim() : null);
        },
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
