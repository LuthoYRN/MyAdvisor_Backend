"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

class Availability extends Model {
  static associate(models) {
    // An advisor can have many availabilities
    Availability.belongsTo(models.Advisor, { foreignKey: "advisorID" });

    // Availability can be tied to many appointment requests via availabilityID
    Availability.hasMany(models.AppointmentRequest, {
      foreignKey: "availabilityID",
    });
  }
}

Availability.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    date: {
      type: DataTypes.DATEONLY,
    },
    time: {
      type: DataTypes.TIME,
    },
    advisorID: {
      type: DataTypes.INTEGER,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
    modelName: "Availability",
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Availability;
