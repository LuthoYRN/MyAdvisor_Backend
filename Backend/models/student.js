"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
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
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          this.setDataValue("name", value.trim());
        },
        get() {
          return this.getDataValue("name");
        },
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          this.setDataValue("surname", value.trim());
        },
        get() {
          return this.getDataValue("surname");
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
        set(value) {
          this.setDataValue("email", value.toLowerCase().trim());
        },
        get() {
          return this.getDataValue("email");
        },
      },
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
        allowNull: false,
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
