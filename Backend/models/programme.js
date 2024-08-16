"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Programme extends Model {
    static associate(models) {
      // define association here
      Programme.belongsTo(models.Faculty, { foreignKey: "facultyID" });
      Programme.hasMany(models.Student, { foreignKey: "programmeID" });
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
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      programmeName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      facultyID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "faculties",
          key: "id",
        },
      },
      coreElectiveCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "programmes",
      modelName: "Programme",
    }
  );

  return Programme;
};
