"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

class CompletedCourse extends Model {
  static associate(models) {
    // Define association here
    CompletedCourse.belongsTo(models.Student, { foreignKey: "studentID" });
    CompletedCourse.belongsTo(models.Course, { foreignKey: "courseID" });
  }
}

CompletedCourse.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    studentID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    courseID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: "CompletedCourse",
  }
);

module.exports = CompletedCourse;
