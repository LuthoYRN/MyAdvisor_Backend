"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AdvisorMajor extends Model {
    static associate(models) {
      AdvisorMajor.belongsTo(models.Advisor, { foreignKey: "advisorID" });
      AdvisorMajor.belongsTo(models.Major, { foreignKey: "majorID" });
    }

    // Static method to find all majors for a given advisor
    static async findByAdvisor(advisorID) {
      try {
        return await AdvisorMajor.findAll({
          where: { advisorID },
          include: [{ model: sequelize.models.Major }],
        });
      } catch (error) {
        throw new Error("Error finding majors by advisor: " + error.message);
      }
    }

    // Static method to find all advisors for a given major
    static async findByMajor(majorID) {
      try {
        return await AdvisorMajor.findAll({
          where: { majorID },
          include: [{ model: sequelize.models.Advisor }],
        });
      } catch (error) {
        throw new Error("Error finding advisors by major: " + error.message);
      }
    }

    // Static method to create an AdvisorMajor association
    static async createAdvisorMajor(advisorID, majorID) {
      try {
        return await AdvisorMajor.create({ advisorID, majorID });
      } catch (error) {
        throw new Error("Error creating AdvisorMajor: " + error.message);
      }
    }
  }

  AdvisorMajor.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      advisorID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "advisors",
          key: "id",
        },
        set(value) {
          if (isNaN(value)) {
            throw new Error("Invalid advisorID");
          }
          this.setDataValue("advisorID", value);
        },
      },
      majorID: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      },
    },
    {
      sequelize,
      modelName: "AdvisorMajor",
      tableName: "advisors_majors",
    }
  );

  return AdvisorMajor;
};
