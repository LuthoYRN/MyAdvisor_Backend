"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      // Association with Prerequisite (courses can have prerequisites)
      Course.hasMany(models.Prerequisite, {
        as: "CoursePrerequisite",
        foreignKey: "courseID",
      });

      Course.hasMany(models.Prerequisite, {
        as: "IsPrerequisiteFor",
        foreignKey: "prerequisiteID",
      });

      // Many-to-Many association with Major and Programme through SharedCourse
      Course.belongsToMany(models.Major, {
        through: models.SharedCourse,
        foreignKey: "courseID",
        otherKey: "majorID",
      });

      Course.belongsToMany(models.Programme, {
        through: models.SharedCourse,
        foreignKey: "courseID",
        otherKey: "programmeID",
      });
    }
  }

  Course.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      courseName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      credits: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nqf_level: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "courses",
      modelName: "Course",
    }
  );

  return Course;
};
