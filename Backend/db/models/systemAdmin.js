"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SystemAdmin extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  SystemAdmin.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Name cannot be empty", // Custom validation message
          },
        },
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Surname cannot be empty", // Custom validation message
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: {
            msg: "Invalid email address", // Validate email format
          },
        },
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "systemAdmin",
      freezeTableName: true,
      timestamps: false,
    }
  );

  return SystemAdmin;
};
