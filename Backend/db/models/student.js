"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const bcrypt = require("bcrypt");

class Student extends Model {
  static associate(models) {
    // Many-to-Many relationship with Advisor through Appointment
    Student.belongsToMany(models.Advisor, {
      through: models.Appointment,
      foreignKey: "studentID",
      otherKey: "advisorID",
    });

    // Many-to-Many relationship with Major through StudentMajor
    Student.belongsToMany(models.Major, {
      through: models.StudentMajor,
      foreignKey: "studentID",
      otherKey: "majorID",
    });

    // One-to-Many relationship with Programme
    Student.belongsTo(models.Programme, {
      foreignKey: "programmeID",
    });

    // One-to-Many relationship with Notification
    Student.hasMany(models.Notification, {
      foreignKey: "studentID",
    });

    // One-to-Many relationship with CompletedCourse
    Student.hasMany(models.CompletedCourse, {
      foreignKey: "studentID",
    });

    // One-to-Many relationship with UploadedFiles
    Student.hasMany(models.UploadedFile, {
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
      allowNull: true,
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: "student",
  }
);

module.exports = Student;
