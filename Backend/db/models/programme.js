"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Programme extends Model {
    static associate(models) {
      // Programme belongs to Faculty
      Programme.belongsTo(models.Faculty, { foreignKey: "facultyID" });

      // Programme has many Students
      Programme.hasMany(models.Student, { foreignKey: "programmeID" });

      // Programme has many Courses through SharedCourse
      Programme.belongsToMany(models.Course, {
        through: models.SharedCourse,
        foreignKey: "programmeID",
        otherKey: "courseID",
      });
    }
  }

  Programme.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      programmeName: {
        type: DataTypes.STRING,
      },
      facultyID: {
        type: DataTypes.INTEGER,
      },
      coreElectiveCount: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "Programme",
    }
  );

  return Programme;
};
