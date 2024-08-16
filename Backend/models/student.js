"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    static associate(models) {
      // Many-to-Many relationship with Advisor through Appointment
      Student.belongsToMany(models.Advisor, {
        through: models.Appointment,
        foreignKey: "studentID",
        otherKey: "advisorID",
      });

      // Many-to-Many relationship with Major through StudentMajor
      Student.belongsToMany(models.Major, {
        through: models.StudentMajor,
        foreignKey: "studentID",
        otherKey: "majorID",
      });

      // One-to-Many relationship with Programme
      Student.belongsTo(models.Programme, {
        foreignKey: "programmeID",
      });
    }
  }

  Student.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      yearOfStudy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      programmeID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "programmes",
          key: "id",
        },
      },
    },
    {
      sequelize,
      tableName: "students",
      modelName: "Student",
    }
  );

  return Student;
};
