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
        type: DataTypes.STRING,
      },
      surname: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      office: {
        type: DataTypes.STRING,
      },
      advisor_level: {
        type: DataTypes.STRING,
      },
      profile_url: {
        type: DataTypes.STRING,
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
