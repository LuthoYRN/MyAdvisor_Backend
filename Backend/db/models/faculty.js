"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Faculty extends Model {
    static associate(models) {
      // Define associations here
      Faculty.hasOne(models.facultyAdmin, { foreignKey: "facultyID" });
      Faculty.hasMany(models.department, { foreignKey: "facultyID" });
      Faculty.hasMany(models.course, { foreignKey: "facultyID" });
      Faculty.hasMany(models.advisor, { foreignKey: "facultyID" });
    }
  }

  Faculty.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      facultyName: {
        validate: {
          notEmpty: true,
        },
        type: DataTypes.STRING,
        allowNull: false,
      },
      curriculumType: {
        type: DataTypes.ENUM("Major", "Programme"),
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: false,
      freezeTableName: true,
      modelName: "faculty",
    }
  );

  return Faculty;
};
