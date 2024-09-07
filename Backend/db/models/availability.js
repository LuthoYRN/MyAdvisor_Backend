"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Availability extends Model {
    static associate(models) {
      // An advisor can have many availabilities
      Availability.belongsTo(models.advisor, { foreignKey: "advisorID" });

      // Availability can be tied to many appointment requests via availabilityID
      Availability.hasMany(models.appointmentRequest, {
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
        allowNull: false,
        type: DataTypes.DATEONLY,
      },
      time: {
        allowNull: false,
        type: DataTypes.TIME,
      },
      advisorID: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      isAvailable: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
      uuid: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: "availability",
      timestamps: false,
      freezeTableName: true,
    }
  );
  return Availability;
};
