"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Major extends Model {
    static associate(models) {
      // Associations
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

    // Static method to find a major by name
    static async findByName(majorName) {
      try {
        return await Major.findOne({ where: { majorName } });
      } catch (error) {
        throw new Error("Error finding major by name: " + error.message);
      }
    }

    // Static method to find all majors within a department
    static async findByDepartment(departmentID) {
      try {
        return await Major.findAll({
          where: { departmentID },
          include: [sequelize.models.Department],
        });
      } catch (error) {
        throw new Error("Error finding majors by department: " + error.message);
      }
    }

    // Static method to create a new major
    static async createMajor(data) {
      try {
        return await Major.create(data);
      } catch (error) {
        throw new Error("Error creating major: " + error.message);
      }
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
        set(value) {
          this.setDataValue("majorName", value.trim());
        },
        get() {
          return this.getDataValue("majorName");
        },
      },
      departmentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "departments",
          key: "id",
        },
        set(value) {
          if (isNaN(value)) {
            throw new Error("Invalid departmentID");
          }
          this.setDataValue("departmentID", value);
        },
        get() {
          return this.getDataValue("departmentID");
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
