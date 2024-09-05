"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

class UploadedFile extends Model {
  static associate(models) {
    // UploadedFile belongs to an Appointment
    UploadedFile.belongsTo(models.Appointment, {
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
        model: "appointments", // Link to appointments table
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
    modelName: "UploadedFile",
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = UploadedFile;
