"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FacultyAdmin extends Model {
    static associate(models) {
      FacultyAdmin.belongsTo(models.faculty, { foreignKey: "facultyID" });
    }
  }

  FacultyAdmin.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        validate: {
          notEmpty: true,
        },
        type: DataTypes.STRING,
        allowNull: false,
      },
      surname: {
        validate: {
          notEmpty: true,
        },
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        validate: {
          isEmail: true,
        },
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        validate: {
          notEmpty: true,
        },
        type: DataTypes.STRING,
        allowNull: false,
      },
      facultyID: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "faculty",
          key: "id",
        },
      },
      profile_url: {
        validate: {
          isUrl: true,
        },
        type: DataTypes.STRING,
        allowNull: true,
      },
      uuid: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: "facultyAdmin",
      timestamps: false,
      freezeTableName: true,
    }
  );

  return FacultyAdmin;
};
