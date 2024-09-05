"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

class Major extends Model {
  static associate(models) {
    // Define associations here
    Major.belongsTo(models.Department, { foreignKey: "departmentID" });
    Major.belongsToMany(models.Course, {
      through: models.SharedCourse,
      foreignKey: "majorID",
    });
    Major.belongsToMany(models.Advisor, {
      through: models.AdvisorMajor,
      foreignKey: "majorID",
    });
    Major.belongsToMany(models.Student, {
      through: models.StudentMajor,
      foreignKey: "majorID",
    });
  }
}

Major.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
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
    modelName: "Major",
    tableName: "majors",
    timestamps: false,
  }
);

module.exports = Major;
