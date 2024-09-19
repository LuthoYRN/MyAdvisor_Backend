"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Advisor extends Model {
    static associate(models) {
      // One-to-many relationship between Advisor and Availability
      Advisor.hasMany(models.availability, {
        foreignKey: "advisorID",
      });
      // Many-to-many relationship between Advisor and Major through AdvisorMajor
      Advisor.belongsToMany(models.major, {
        through: models.advisorMajor,
        foreignKey: "advisorID",
        otherKey: "majorID",
      });

      // Many-to-many relationship between Advisor and Student through Appointment
      Advisor.belongsToMany(models.student, {
        through: models.appointment,
        foreignKey: "advisorID",
        otherKey: "studentID",
      });
      Advisor.belongsToMany(models.programme, {
        through: models.advisorProgramme,
        foreignKey: "advisorID",
      });
      Advisor.belongsTo(models.advisorCluster, { foreignKey: "clusterID" });
      Advisor.belongsTo(models.faculty, { foreignKey: "facultyID" });
    }
  }

  Advisor.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        validate: {
          notEmpty: {
            msg: "Name cannot be empty", // Custom validation message
          },
          isAlphaOnly(value) {
            // Custom validator to check if the name contains any numeric values
            const regex = /^[A-Za-z\s]+$/;
            if (!regex.test(value)) {
              throw new Error(
                "Name must only contain letters and spaces (no numbers)."
              );
            }
          },
        },
        type: DataTypes.STRING,
        allowNull: false,
      },
      surname: {
        validate: {
          notEmpty: {
            msg: "Surname cannot be empty", // Custom validation message
          },
          isAlphaOnly(value) {
            // Custom validator to check if the name contains any numeric values
            const regex = /^[A-Za-z\s]+$/;
            if (!regex.test(value)) {
              throw new Error(
                "Surname must only contain letters and spaces (no numbers)."
              );
            }
          },
        },
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        validate: {
          isEmail: {
            msg: "Invalid email address", // Validate email format
          },
        },
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      office: {
        validate: {
          notEmpty: {
            msg: "Location must not be empty", // Validate email format
          },
        },
        type: DataTypes.STRING,
        allowNull: false,
      },
      advisor_level: {
        validate: {
          isIn: [["advisor", "senior"]],
          notEmpty: true,
        },
        type: DataTypes.STRING,
        allowNull: false,
      },
      profile_url: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      clusterID: {
        type: DataTypes.INTEGER,
        allowNull: true, // Allowing null in case an advisor is not assigned to a cluster
        references: {
          model: "advisorCluster",
          key: "id",
        },
      },
      facultyID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "faculty",
          key: "id",
        },
      },
      uuid: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: "advisor",
      timestamps: false,
      freezeTableName: true,
    }
  );
  return Advisor;
};
