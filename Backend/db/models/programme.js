"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Programme extends Model {
    static associate(models) {
      // Programme belongs to Faculty
      Programme.belongsTo(models.faculty, { foreignKey: "facultyID" });

      // Programme has many Students
      Programme.hasMany(models.student, { foreignKey: "programmeID" });

      // Programme has many Courses through SharedCourse
      Programme.belongsToMany(models.course, {
        through: models.sharedCourse,
        foreignKey: "programmeID",
        otherKey: "courseID",
      });
    }
  }

  Programme.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
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
      modelName: "programme",
      freezeTableName: true,
    }
  );

  return Programme;
};
