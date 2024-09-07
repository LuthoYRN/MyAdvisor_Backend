"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CompletedCourse extends Model {
    static associate(models) {
      // Define association here
      CompletedCourse.belongsTo(models.student, { foreignKey: "studentID" });
      CompletedCourse.belongsTo(models.course, { foreignKey: "courseID" });
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
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: false,
      freezeTableName: true,
      modelName: "completedCourse",
    }
  );

  return CompletedCourse;
};
