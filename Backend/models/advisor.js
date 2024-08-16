"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Advisor extends Model {
    static associate(models) {
      Advisor.belongsTo(models.Department, { foreignKey: "departmentID" });
      Advisor.hasMany(models.Availability, { foreignKey: "advisorID" });
      Advisor.belongsToMany(models.Student, {
        through: models.Appointment,
        foreignKey: "advisorID",
        otherKey: "studentID",
      });
      Advisor.belongsToMany(models.Major, {
        through: models.AdvisorMajor,
        foreignKey: "advisorID",
        otherKey: "majorID",
      });
    }

    // Method to find an advisor by email
    static async findByEmail(email) {
      try {
        return await Advisor.findOne({ where: { email } });
      } catch (error) {
        throw new Error("Error finding advisor: " + error.message);
      }
    }

    // Method to find all advisors in a specific department
    static async findByDepartment(departmentID) {
      try {
        return await Advisor.findAll({ where: { departmentID } });
      } catch (error) {
        throw new Error("Error finding advisors: " + error.message);
      }
    }

    // Method to find all advisors associated with a specific major
    static async findByMajor(majorID) {
      try {
        return await Advisor.findAll({
          include: [
            {
              model: sequelize.models.Major,
              where: { id: majorID },
              through: { attributes: [] },
            },
          ],
        });
      } catch (error) {
        throw new Error("Error finding advisors by major: " + error.message);
      }
    }

    // Method to create a new advisor
    static async createAdvisor(data) {
      try {
        return await Advisor.create(data);
      } catch (error) {
        throw new Error("Error creating advisor: " + error.message);
      }
    }
  }

  Advisor.init(
    {
      uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      surname: { type: DataTypes.STRING, allowNull: false },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      office_location: { type: DataTypes.STRING },
      advisor_level: { type: DataTypes.STRING },
      departmentID: {
        type: DataTypes.INTEGER,
        references: {
          model: "departments",
          key: "id",
        },
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "advisors",
      modelName: "Advisor",
    }
  );

  return Advisor;
};
