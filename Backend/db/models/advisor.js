"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Advisor extends Model {
    static associate(models) {
      // One-to-many relationship between Advisor and Availability
      Advisor.hasMany(models.availability, {
        foreignKey: "advisorID",
      });
      // Many-to-many relationship between Advisor and Major through AdvisorMajor
      Advisor.belongsToMany(models.major, {
        through: models.advisorMajor,
        foreignKey: "advisorID",
        otherKey: "majorID",
      });

      // Many-to-many relationship between Advisor and Student through Appointment
      Advisor.belongsToMany(models.student, {
        through: models.appointment,
        foreignKey: "advisorID",
        otherKey: "studentID",
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
          notEmpty: {
            msg: "Name cannot be empty", // Custom validation message
          },
        },
        type: DataTypes.STRING,
        allowNull: false,
      },
      surname: {
        validate: {
          notEmpty: {
            msg: "Surname cannot be empty", // Custom validation message
          },
        },
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        validate: {
          isEmail: {
            msg: "Invalid email address", // Validate email format
          },
        },
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      office: {
        validate: {
          notEmpty: {
            msg: "Location must not be empty", // Validate email format
          },
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
