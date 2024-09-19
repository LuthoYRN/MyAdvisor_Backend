"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Programme extends Model {
    static associate(models) {
      // Programme belongs to a Department
      Programme.belongsTo(models.department, { foreignKey: "departmentID" });

      // Programme has many Courses (through sharedCourse table)
      Programme.belongsToMany(models.course, {
        through: models.sharedCourse,
        foreignKey: "programmeID",
      });

      // Programme has many Advisors (through advisorProgramme table)
      Programme.belongsToMany(models.advisor, {
        through: models.advisorProgramme,
        foreignKey: "programmeID",
      });

      // Programme is assigned to many Students
      Programme.hasMany(models.student, {
        foreignKey: "programmeID",
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
      prefix: {
        type: DataTypes.STRING,
        validate: {
          isIn: [["BBusSci", "BCom", "BscEng", "BSc", "BAS"]],
        },
        allowNull: false,
      },
      programmeName: {
        validate: {
          notEmpty: true,
        },
        type: DataTypes.STRING,
        allowNull: false,
      },
      electiveCreditCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
      modelName: "programme",
      freezeTableName: true,
      timestamps: false,
    }
  );

  return Programme;
};
