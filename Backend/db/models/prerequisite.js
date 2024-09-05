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
  }

  Prerequisite.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      courseID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "courses", // Reference to the courses table
          key: "id",
        },
      },
      prerequisiteID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "courses", // Reference to the courses table
          key: "id",
        },
      },
    },
    {
      sequelize,
      timestamps: false,
      tableName: "prerequisites",
      modelName: "Prerequisite",
    }
  );

  return Prerequisite;
};
