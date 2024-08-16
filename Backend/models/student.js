"use strict";
const User = require("./User");

module.exports = (sequelize, DataTypes) => {
  class Student extends User {
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
    }

    // Static method to create a new student
    static async createStudent(data) {
      try {
        return await Student.create(data);
      } catch (error) {
        throw new Error("Error creating student: " + error.message);
      }
    }
  }

  Student.init(
    {
      ...User.initBaseFields(), // Inherit fields from User
      yearOfStudy: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          this.setDataValue("yearOfStudy", value.trim());
        },
        get() {
          return this.getDataValue("yearOfStudy");
        },
      },
      programmeID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "programmes",
          key: "id",
        },
        set(value) {
          if (isNaN(value)) {
            throw new Error("Invalid programmeID");
          }
          this.setDataValue("programmeID", value);
        },
        get() {
          return this.getDataValue("programmeID");
        },
      },
    },
    {
      sequelize,
      tableName: "students",
      modelName: "Student",
    }
  );

  return Student;
};
