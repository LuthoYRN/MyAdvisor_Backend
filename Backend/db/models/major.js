"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Major extends Model {
    static associate(models) {
      // Define associations here
      Major.belongsTo(models.department, { foreignKey: "departmentID" });
      Major.belongsToMany(models.course, {
        through: models.sharedCourse,
        foreignKey: "majorID",
      });
      Major.belongsToMany(models.advisor, {
        through: models.advisorMajor,
        foreignKey: "majorID",
      });
      Major.belongsToMany(models.student, {
        through: models.studentsMajor,
        foreignKey: "majorID",
      });
    }
  }

  Major.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      majorName: {
        validate: {
          notEmpty: true,
        },
        type: DataTypes.STRING,
        allowNull: false,
      },
      departmentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "department",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "major",
      freezeTableName: true,
      timestamps: false,
    }
  );

  return Major;
};
