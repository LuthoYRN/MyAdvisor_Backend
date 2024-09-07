"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Advisor extends Model {
    static associate(models) {
      // One-to-many relationship between Advisor and Availability
      Advisor.hasMany(models.availability, {
        foreignKey: "advisorID",
        as: "availabilities",
      });

      // Many-to-many relationship between Advisor and Major through AdvisorMajor
      Advisor.belongsToMany(models.major, {
        through: models.advisorMajor,
        foreignKey: "advisorID",
        otherKey: "majorID",
        as: "majors",
      });

      // Many-to-many relationship between Advisor and Student through Appointment
      Advisor.belongsToMany(models.student, {
        through: models.appointment,
        foreignKey: "advisorID",
        otherKey: "studentID",
        as: "students",
      });
    }
  }

  Advisor.init(
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
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
      },
      password: {
        validate: {
          notEmpty: true,
        },
        type: DataTypes.STRING,
        allowNull: false,
      },
      office: {
        validate: {
          notEmpty: true,
        },
        type: DataTypes.STRING,
        allowNull: false,
      },
      advisor_level: {
        validate: {
          isIn: [["advisor", "senior"]],
          notEmpty: true,
        },
        type: DataTypes.STRING,
        allowNull: false,
      },
      profile_url: {
        validate: {
          isUrl: true,
        },
        allowNull: true,
        type: DataTypes.STRING,
      },
      uuid: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: "advisor",
      timestamps: false,
      freezeTableName: true,
    }
  );
  return Advisor;
};
