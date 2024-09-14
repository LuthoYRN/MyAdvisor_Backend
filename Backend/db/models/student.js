"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    static associate(models) {
      // Many-to-Many relationship with Advisor through Appointment
      Student.belongsToMany(models.advisor, {
        through: models.appointment,
        foreignKey: "studentID",
        otherKey: "advisorID",
      });

      // Many-to-Many relationship with Major through StudentMajor
      Student.belongsToMany(models.major, {
        through: models.studentsMajor,
        foreignKey: "studentID",
        otherKey: "majorID",
      });

      // One-to-Many relationship with Programme
      Student.belongsTo(models.programme, {
        foreignKey: "programmeID",
      });
      // One-to-Many relationship with CompletedCourse
      Student.hasMany(models.completedCourse, {
        foreignKey: "studentID",
      });
    }
  }

  Student.init(
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
        allowNull: false,
        type: DataTypes.STRING,
      },
      surname: {
        validate: {
          notEmpty: {
            msg: "Surname cannot be empty", // Custom validation message
          },
        },
        allowNull: false,
        type: DataTypes.STRING,
      },
      email: {
        validate: {
          isEmail: {
            msg: "Invalid email address", // Validate email format
          },
        },
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      programmeID: {
        allowNull: true,
        type: DataTypes.STRING,
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
      timestamps: false,
      freezeTableName: true,
      modelName: "student",
    }
  );
  return Student;
};
