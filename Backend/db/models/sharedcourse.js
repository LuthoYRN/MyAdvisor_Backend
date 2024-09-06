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
        allowNull: true,
        type: DataTypes.STRING,
        references: {
          model: "major",
          key: "id",
        },
      },
      courseID: {
        type: DataTypes.STRING,
        references: {
          model: "course",
          key: "id",
        },
      },
      programmeID: {
        allowNull: true,
        type: DataTypes.STRING,
        references: {
          model: "programme",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "sharedCourse",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return SharedCourse;
};
