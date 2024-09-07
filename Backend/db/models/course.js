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
        validate: {
          notEmpty: true,
        },
        type: DataTypes.STRING,
        allowNull: false,
      },
      credits: {
        validate: {
          max: 72,
        },
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nqf_level: {
        validate: {
          isIn: [[5, 6, 7, 8]],
        },
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      uuid: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
