"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
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

      // One-to-Many relationship with Notification
      Student.hasMany(models.notification, {
        foreignKey: "studentID",
      });

      // One-to-Many relationship with CompletedCourse
      Student.hasMany(models.completedCourse, {
        foreignKey: "studentID",
      });

      // One-to-Many relationship with UploadedFiles
      Student.hasMany(models.uploadedFile, {
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
          notEmpty: true,
        },
        allowNull: false,
        type: DataTypes.STRING,
      },
      surname: {
        validate: {
          notEmpty: true,
        },
        allowNull: false,
        type: DataTypes.STRING,
      },
      email: {
        validate: {
          isEmail: true,
        },
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      confirmPassword: {
        type: DataTypes.VIRTUAL,
        set(value) {
          if (value === this.password) {
            const hashPassword = bcrypt.hashSync(value, 10);
            this.setDataValue("password", hashPassword);
          } else {
            throw new Error("Password and confirm password must be the same");
          }
        },
      },
      programmeID: {
        allowNull: true,
        type: DataTypes.STRING,
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
      timestamps: false,
      freezeTableName: true,
      modelName: "student",
    }
  );
  return Student;
};
