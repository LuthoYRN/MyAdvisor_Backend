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

    // Static method to find courses by major
    static async findByMajor(majorID) {
      try {
        return await Course.findAll({
          include: [
            {
              model: sequelize.models.Major,
              where: { id: majorID },
              through: { attributes: [] },
            },
          ],
        });
      } catch (error) {
        throw new Error("Error finding courses by major: " + error.message);
      }
    }

    // Static method to find courses by programme
    static async findByProgramme(programmeID) {
      try {
        return await Course.findAll({
          include: [
            {
              model: sequelize.models.Programme,
              where: { id: programmeID },
              through: { attributes: [] },
            },
          ],
        });
      } catch (error) {
        throw new Error("Error finding courses by programme: " + error.message);
      }
    }

    // Static method to create a new course
    static async createCourse(data) {
      try {
        return await Course.create(data);
      } catch (error) {
        throw new Error("Error creating course: " + error.message);
      }
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
        set(value) {
          this.setDataValue("courseName", value.trim());
        },
        get() {
          return this.getDataValue("courseName");
        },
      },
      credits: {
        type: DataTypes.INTEGER,
        allowNull: false,
        set(value) {
          if (isNaN(value) || value < 0) {
            throw new Error("Invalid number of credits");
          }
          this.setDataValue("credits", value);
        },
        get() {
          return this.getDataValue("credits");
        },
      },
      nqf_level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        set(value) {
          if (isNaN(value) || value < 5 || value > 10) {
            throw new Error("Invalid NQF level");
          }
          this.setDataValue("nqf_level", value);
        },
        get() {
          return this.getDataValue("nqf_level");
        },
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
