"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Faculty extends Model {
    static associate(models) {
      Faculty.hasOne(models.FacultyAdmin, { foreignKey: "facultyID" });
    }

    // Static method to find a faculty by name
    static async findByName(facultyName) {
      try {
        return await Faculty.findOne({ where: { facultyName } });
      } catch (error) {
        throw new Error("Error finding faculty by name: " + error.message);
      }
    }

    // Static method to find a faculty by ID
    static async findById(id) {
      try {
        return await Faculty.findByPk(id);
      } catch (error) {
        throw new Error("Error finding faculty by ID: " + error.message);
      }
    }
  }

  Faculty.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      facultyName: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          this.setDataValue("facultyName", value.trim());
        },
        get() {
          return this.getDataValue("facultyName");
        },
      },
    },
    {
      sequelize,
      tableName: "faculties",
      modelName: "Faculty",
    }
  );

  return Faculty;
};
