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
        allowNull: false,
        type: DataTypes.STRING,
      },
      facultyID: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      coreElectiveCount: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      uuid: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
