"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UploadedFile extends Model {
    static associate(models) {
      // UploadedFile belongs to an Appointment
      UploadedFile.belongsTo(models.appointment, {
        foreignKey: "appointmentID",
        as: "appointment",
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
        references: {
          model: "appointment", // Link to appointments table
          key: "id",
        },
        onDelete: "CASCADE", // Delete file if appointment is deleted
      },
      fileName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      filePathURL: {
        type: DataTypes.STRING,
        allowNull: false,
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
