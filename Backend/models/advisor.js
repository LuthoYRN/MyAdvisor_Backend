"use strict";
const User = require("./User");

module.exports = (sequelize, DataTypes) => {
  class Advisor extends User {
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
        return await sequelize.models.Advisor.findAll({
          include: [
            {
              model: sequelize.models.Major,
              where: { id: majorID },
              through: { attributes: [] }, // This excludes the junction table attributes
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
      ...User.initBaseFields(), // Inherit fields from User
      office_location: {
        type: DataTypes.STRING,
        set(value) {
          this.setDataValue("office_location", value ? value.trim() : null);
        },
        get() {
          return this.getDataValue("office_location");
        },
      },
      advisor_level: {
        type: DataTypes.STRING,
        allowNull: false,
      },
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
      getterMethods: {
        // Getter for full name
        fullName() {
          return `${this.name} ${this.surname}`;
        },
      },
    }
  );

  return Advisor;
};
