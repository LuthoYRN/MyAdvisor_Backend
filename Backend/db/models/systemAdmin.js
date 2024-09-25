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
          isAlphaOnly(value) {
            // Custom validator to check if the name contains any numeric values
            const regex = /^[A-Za-z\s]+$/;
            if (!regex.test(value)) {
              throw new Error(
                "Name must only contain letters and spaces (no numbers)."
              );
            }
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
          isAlphaOnly(value) {
            // Custom validator to check if the name contains any numeric values
            const regex = /^[A-Za-z\s]+$/;
            if (!regex.test(value)) {
              throw new Error(
                "Surname must only contain letters and spaces (no numbers)."
              );
            }
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
      uuid: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
