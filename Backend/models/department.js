"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    static associate(models) {
      Department.hasMany(models.Advisor, { foreignKey: "departmentID" });
      Department.hasMany(models.Major, { foreignKey: "departmentID" });
      Department.belongsTo(models.Faculty, { foreignKey: "facultyID" });
    }
    // Static method to find all departments within a faculty
    static async findByFaculty(facultyID) {
      try {
        return await Department.findAll({
          where: { facultyID },
          include: [sequelize.models.Faculty],
        });
      } catch (error) {
        throw new Error(
          "Error finding departments by faculty: " + error.message
        );
      }
    }

    // Static method to create a new department
    static async createDepartment(data) {
      try {
        return await Department.create(data);
      } catch (error) {
        throw new Error("Error creating department: " + error.message);
      }
    }
  }

  Department.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          this.setDataValue("name", value.trim());
        },
        get() {
          return this.getDataValue("name");
        },
      },
      facultyID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "faculties",
          key: "id",
        },
        set(value) {
          if (isNaN(value)) {
            throw new Error("Invalid facultyID");
          }
          this.setDataValue("facultyID", value);
        },
        get() {
          return this.getDataValue("facultyID");
        },
      },
    },
    {
      sequelize,
      tableName: "departments",
      modelName: "Department",
    }
  );

  return Department;
};
