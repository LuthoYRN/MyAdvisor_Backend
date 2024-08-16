"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AdviceRecord extends Model {
    static associate(models) {
      AdviceRecord.belongsTo(models.Appointment, {
        foreignKey: "appointmentID",
      });
    }

    // Method to create a new AdviceRecord
    static async createAdviceRecord(appointmentID) {
      try {
        return await AdviceRecord.create({
          appointmentID,
          createdAt: new Date(),
        });
      } catch (error) {
        throw new Error("Error creating advice record: " + error.message);
      }
    }

    // Method to fetch all advice records for a specific appointment
    static async findByAppointment(appointmentID) {
      try {
        return await AdviceRecord.findAll({
          where: { appointmentID },
          include: [{ model: sequelize.models.Appointment }],
        });
      } catch (error) {
        throw new Error("Error fetching advice records: " + error.message);
      }
    }

    // Method to fetch a single advice record by ID
    static async findById(id) {
      try {
        return await AdviceRecord.findByPk(id);
      } catch (error) {
        throw new Error("Error fetching advice record: " + error.message);
      }
    }

    // Method to delete an advice record
    static async deleteAdviceRecord(id) {
      try {
        const record = await AdviceRecord.findByPk(id);
        if (record) {
          await record.destroy();
          return true;
        } else {
          throw new Error("Advice record not found");
        }
      } catch (error) {
        throw new Error("Error deleting advice record: " + error.message);
      }
    }
  }

  AdviceRecord.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      appointmentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "appointments",
          key: "id",
        },
        set(value) {
          if (isNaN(value)) {
            throw new Error("Invalid appointmentID");
          }
          this.setDataValue("appointmentID", value);
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        set(value) {
          if (!(value instanceof Date)) {
            throw new Error("Invalid date for createdAt");
          }
          this.setDataValue("createdAt", value);
        },
        get() {
          const rawValue = this.getDataValue("createdAt");
          return rawValue ? rawValue.toLocaleString() : null;
        },
      },
    },
    {
      sequelize,
      tableName: "advice_records",
      modelName: "AdviceRecord",
      timestamps: false,
    }
  );

  return AdviceRecord;
};
