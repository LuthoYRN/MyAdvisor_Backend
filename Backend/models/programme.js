"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Programme extends Model {
    static associate(models) {
      // Define associations
      Programme.belongsTo(models.Faculty, { foreignKey: "facultyID" });
      Programme.hasMany(models.Student, { foreignKey: "programmeID" });
      Programme.belongsToMany(models.Course, {
        through: models.SharedCourse,
        foreignKey: "programmeID",
        otherKey: "courseID",
      });
    }
    // Static method to find all programmes within a faculty
    static async findByFaculty(facultyID) {
      try {
        return await Programme.findAll({
          where: { facultyID },
          include: [sequelize.models.Faculty],
        });
      } catch (error) {
        throw new Error(
          "Error finding programmes by faculty: " + error.message
        );
      }
    }

    // Static method to create a new programme
    static async createProgramme(data) {
      try {
        return await Programme.create(data);
      } catch (error) {
        throw new Error("Error creating programme: " + error.message);
      }
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
        set(value) {
          this.setDataValue("programmeName", value.trim());
        },
        get() {
          return this.getDataValue("programmeName");
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
      coreElectiveCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        set(value) {
          if (isNaN(value) || value < 0) {
            throw new Error("Invalid coreElectiveCount");
          }
          this.setDataValue("coreElectiveCount", value);
        },
        get() {
          return this.getDataValue("coreElectiveCount");
        },
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
