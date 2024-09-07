"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class adviceRecord extends Model {
    static associate(models) {
      // Define association with Appointments model
      adviceRecord.belongsTo(models.appointment, {
        foreignKey: "appointmentID",
        targetKey: "id",
      });
    }
  }

  adviceRecord.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      appointmentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "appointment",
          key: "id",
        },
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "adviceRecord",
      timestamps: false,
      freezeTableName: true,
    }
  );

  return adviceRecord;
};
