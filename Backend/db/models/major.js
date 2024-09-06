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
      primaryKey: true,
      type: DataTypes.STRING,
    },
    majorName: {
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

module.exports = Major;
