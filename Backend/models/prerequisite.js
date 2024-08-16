"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Prerequisite extends Model {
    static associate(models) {
      // Define association with the Course model
      Prerequisite.belongsTo(models.Course, {
        as: "Course",
        foreignKey: "courseID",
      });

      Prerequisite.belongsTo(models.Course, {
        as: "PrerequisiteCourse",
        foreignKey: "prerequisiteID",
      });
    }

    // Static method to find all prerequisites for a specific course
    static async findByCourse(courseID) {
      try {
        return await Prerequisite.findAll({
          where: { courseID },
          include: [
            { model: sequelize.models.Course, as: "PrerequisiteCourse" },
          ],
        });
      } catch (error) {
        throw new Error(
          "Error finding prerequisites for the course: " + error.message
        );
      }
    }

    // Static method to create a new prerequisite
    static async createPrerequisite(data) {
      try {
        return await Prerequisite.create(data);
      } catch (error) {
        throw new Error("Error creating prerequisite: " + error.message);
      }
    }
  }

  Prerequisite.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      courseID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "courses", // Reference to the courses table
          key: "id",
        },
        set(value) {
          if (isNaN(value)) {
            throw new Error("Invalid courseID");
          }
          this.setDataValue("courseID", value);
        },
        get() {
          return this.getDataValue("courseID");
        },
      },
      prerequisiteID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "courses", // Reference to the courses table
          key: "id",
        },
        set(value) {
          if (isNaN(value)) {
            throw new Error("Invalid prerequisiteID");
          }
          this.setDataValue("prerequisiteID", value);
        },
        get() {
          return this.getDataValue("prerequisiteID");
        },
      },
    },
    {
      sequelize,
      tableName: "prerequisites",
      modelName: "Prerequisite",
    }
  );

  return Prerequisite;
};
