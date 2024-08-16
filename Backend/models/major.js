"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Major extends Model {
    static associate(models) {
      // define association here
      Major.belongsTo(models.Department, { foreignKey: "departmentID" });
      Major.belongsToMany(models.Student, {
        through: models.StudentMajor,
        foreignKey: "majorID",
      });
      Major.belongsToMany(models.Course, {
        through: models.SharedCourse,
        foreignKey: "majorID",
        otherKey: "courseID",
      });
      Major.belongsToMany(models.Advisor, {
        through: models.AdvisorMajor,
        foreignKey: "majorID",
        otherKey: "advisorID",
      });
    }
  }

  Major.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      majorName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      departmentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "departments",
          key: "id",
        },
      },
    },
    {
      sequelize,
      tableName: "majors",
      modelName: "Major",
    }
  );

  return Major;
};
