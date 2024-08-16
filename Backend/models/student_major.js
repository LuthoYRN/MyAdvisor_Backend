"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class StudentMajor extends Model {
    static associate(models) {
      // define association here
      StudentMajor.belongsTo(models.Student, { foreignKey: "studentID" });
      StudentMajor.belongsTo(models.Major, { foreignKey: "majorID" });
    }
    // Static method to find all majors for a specific student
    static async findByStudent(studentID) {
      try {
        return await StudentMajor.findAll({
          where: { studentID },
          include: [sequelize.models.Major],
        });
      } catch (error) {
        throw new Error("Error finding majors for student: " + error.message);
      }
    }
    // Static method to create a new student-major relationship
    static async createStudentMajor(data) {
      try {
        return await StudentMajor.create(data);
      } catch (error) {
        throw new Error(
          "Error creating student-major relationship: " + error.message
        );
      }
    }
  }

  StudentMajor.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      studentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "students",
          key: "id",
        },
        set(value) {
          if (isNaN(value)) {
            throw new Error("Invalid studentID");
          }
          this.setDataValue("studentID", value);
        },
        get() {
          return this.getDataValue("studentID");
        },
      },
      majorID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "majors",
          key: "id",
        },
        set(value) {
          if (isNaN(value)) {
            throw new Error("Invalid majorID");
          }
          this.setDataValue("majorID", value);
        },
        get() {
          return this.getDataValue("majorID");
        },
      },
    },
    {
      sequelize,
      tableName: "students_majors",
      modelName: "StudentMajor",
    }
  );

  return StudentMajor;
};
