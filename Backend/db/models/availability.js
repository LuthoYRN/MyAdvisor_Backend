"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Availability extends Model {
    static associate(models) {
      Availability.belongsTo(models.advisor, {
        foreignKey: "advisorID",
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
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      advisorID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "advisor",
          key: "id",
        },
      },
      times: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false, // Array of time strings
      },
      dayOfWeek: {
        type: DataTypes.ENUM(
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ),
        allowNull: false,
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
