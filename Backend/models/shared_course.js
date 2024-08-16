"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SharedCourse extends Model {
    static associate(models) {
      // define association here
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
        allowNull: false,
      },
      majorID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "majors",
          key: "id",
        },
      },
      courseID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "courses",
          key: "id",
        },
      },
      programmeID: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
      validate: {
        eitherMajorOrProgramme() {
          if (
            (this.majorID === null && this.programmeID === null) ||
            (this.majorID !== null && this.programmeID !== null)
          ) {
            throw new Error(
              "Either majorID or programmeID must be null, but not both."
            );
          }
        },
      },
    }
  );

  return SharedCourse;
};
