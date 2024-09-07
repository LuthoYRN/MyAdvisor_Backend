"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      // Association with Prerequisite (courses can have prerequisites)
      Course.hasMany(models.prerequisite, {
        as: "CoursePrerequisite",
        foreignKey: "courseID",
      });

      Course.hasMany(models.prerequisite, {
        as: "IsPrerequisiteFor",
        foreignKey: "prerequisiteID",
      });

      // Many-to-Many association with Major and Programme through SharedCourse
      Course.belongsToMany(models.major, {
        through: models.sharedCourse,
        foreignKey: "courseID",
        otherKey: "majorID",
      });

      Course.belongsToMany(models.programme, {
        through: models.sharedCourse,
        foreignKey: "courseID",
        otherKey: "programmeID",
      });
    }
  }

  Course.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
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
      modelName: "course",
      freezeTableName: true,
      timestamps: false,
    }
  );

  return Course;
};
