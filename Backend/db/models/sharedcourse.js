"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SharedCourse extends Model {
    static associate(models) {
      SharedCourse.belongsTo(models.Major, { foreignKey: "majorID" });
      SharedCourse.belongsTo(models.Course, { foreignKey: "courseID" });
      SharedCourse.belongsTo(models.Programme, { foreignKey: "programmeID" });
    }
  }
  SharedCourse.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      majorID: {
        type: DataTypes.INTEGER,
        references: {
          model: "majors",
          key: "id",
        },
      },
      courseID: {
        type: DataTypes.INTEGER,
        references: {
          model: "courses",
          key: "id",
        },
      },
      programmeID: {
        type: DataTypes.INTEGER,
        references: {
          model: "programmes",
          key: "id",
        },
      },
    },
    {
      sequelize,
      tableName: "shared_courses",
      modelName: "SharedCourse",
    }
  );
  return SharedCourse;
};
