"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UploadedFile extends Model {
    static associate(models) {
      // UploadedFile belongs to an Appointment
      UploadedFile.belongsTo(models.appointment, {
        foreignKey: "appointmentID",
      });
    }
  }

  UploadedFile.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      appointmentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "appointment", // Link to appointments table
          key: "id",
        },
      },
      fileName: {
        validate: {
          notEmpty: true,
        },
        type: DataTypes.STRING,
        allowNull: false,
      },
      filePathURL: {
        validate: {
          isUrl: true,
        },
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
      modelName: "uploadedFile",
      freezeTableName: true,
      timestamps: false,
    }
  );

  return UploadedFile;
};
