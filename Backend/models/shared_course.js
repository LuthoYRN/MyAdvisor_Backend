"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SharedCourse extends Model {
    static associate(models) {
      // define association here
      SharedCourse.belongsTo(models.Major, { foreignKey: "majorID" });
      SharedCourse.belongsTo(models.Course, { foreignKey: "courseID" });
      SharedCourse.belongsTo(models.Programme, { foreignKey: "programmeID" });
    }

    // Static method to find all shared courses for a specific major
    static async findByMajor(majorID) {
      try {
        return await SharedCourse.findAll({
          where: { majorID },
          include: [sequelize.models.Course],
        });
      } catch (error) {
        throw new Error(
          "Error finding shared courses for major: " + error.message
        );
      }
    }

    // Static method to find all shared courses for a specific programme
    static async findByProgramme(programmeID) {
      try {
        return await SharedCourse.findAll({
          where: { programmeID },
          include: [sequelize.models.Course],
        });
      } catch (error) {
        throw new Error(
          "Error finding shared courses for programme: " + error.message
        );
      }
    }

    // Static method to create a new shared course
    static async createSharedCourse(data) {
      try {
        return await SharedCourse.create(data);
      } catch (error) {
        throw new Error("Error creating shared course: " + error.message);
      }
    }
  }

  SharedCourse.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      majorID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "majors",
          key: "id",
        },
        set(value) {
          if (isNaN(value)) {
            throw new Error("Invalid majorID");
          }
          this.setDataValue("majorID", value);
        },
        get() {
          return this.getDataValue("majorID");
        },
      },
      courseID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "courses",
          key: "id",
        },
        set(value) {
          if (isNaN(value)) {
            throw new Error("Invalid courseID");
          }
          this.setDataValue("courseID", value);
        },
        get() {
          return this.getDataValue("courseID");
        },
      },
      programmeID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "programmes",
          key: "id",
        },
        set(value) {
          if (isNaN(value)) {
            throw new Error("Invalid programmeID");
          }
          this.setDataValue("programmeID", value);
        },
        get() {
          return this.getDataValue("programmeID");
        },
      },
    },
    {
      sequelize,
      tableName: "shared_courses",
      modelName: "SharedCourse",
      validate: {
        eitherMajorOrProgramme() {
          if (
            (this.majorID === null && this.programmeID === null) ||
            (this.majorID !== null && this.programmeID !== null)
          ) {
            throw new Error(
              "Either majorID or programmeID must be null, but not both."
            );
          }
        },
      },
    }
  );

  return SharedCourse;
};
