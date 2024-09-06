"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

class Advisor extends Model {
  static associate(models) {
    // One-to-many relationship between Advisor and Availability
    Advisor.hasMany(models.Availability, {
      foreignKey: "advisorID",
      as: "availabilities",
    });

    // Many-to-many relationship between Advisor and Major through AdvisorMajor
    Advisor.belongsToMany(models.Major, {
      through: models.AdvisorMajor,
      foreignKey: "advisorID",
      otherKey: "majorID",
      as: "majors",
    });

    // Many-to-many relationship between Advisor and Student through Appointment
    Advisor.belongsToMany(models.Student, {
      through: models.Appointment,
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
    modelName: "Advisor",
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Advisor;
