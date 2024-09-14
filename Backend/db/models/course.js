"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
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
      Course.belongsTo(models.faculty, {
        foreignKey: "facultyID",
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
      prerequisites: {
        type: DataTypes.ARRAY(DataTypes.STRING), // Storing prerequisites as array
        allowNull: true, // Array of time strings
      },
      equivalents: {
        type: DataTypes.ARRAY(DataTypes.STRING), // Storing equivalents as array
        allowNull: true, // Array of time strings
      },
      specialRequirements: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bothSemesters: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Set default value to false
      },
      facultyID: {
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
