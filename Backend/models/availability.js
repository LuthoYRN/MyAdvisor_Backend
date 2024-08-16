"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Availability extends Model {
    static associate(models) {
      Availability.belongsTo(models.Advisor, {
        foreignKey: "advisorID",
      });
    }

    // Static method to find availability by advisor ID
    static async findByAdvisor(advisorID) {
      try {
        return await Availability.findAll({
          where: { advisorID },
        });
      } catch (error) {
        throw new Error(
          "Error finding availability by advisor: " + error.message
        );
      }
    }

    // Static method to check availability for a specific date and time range
    static async checkAvailability(advisorID, date, startTime, endTime) {
      try {
        return await Availability.findOne({
          where: {
            advisorID,
            date,
            startTime: { [sequelize.Op.lte]: startTime },
            endTime: { [sequelize.Op.gte]: endTime },
            isAvailable: true,
          },
        });
      } catch (error) {
        throw new Error("Error checking availability: " + error.message);
      }
    }

    // Static method to create new availability
    static async createAvailability(data) {
      try {
        return await Availability.create(data);
      } catch (error) {
        throw new Error("Error creating availability: " + error.message);
      }
    }
  }

  Availability.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
        set(value) {
          if (!/^\d{2}:\d{2}(:\d{2})?$/.test(value)) {
            throw new Error("Invalid time format");
          }
          this.setDataValue("startTime", value);
        },
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
        set(value) {
          if (!/^\d{2}:\d{2}(:\d{2})?$/.test(value)) {
            throw new Error("Invalid time format");
          }
          this.setDataValue("endTime", value);
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
      isAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        set(value) {
          this.setDataValue("isAvailable", Boolean(value));
        },
        get() {
          return this.getDataValue("isAvailable");
        },
      },
    },
    {
      sequelize,
      tableName: "availability",
      modelName: "Availability",
    }
  );

  return Availability;
};
