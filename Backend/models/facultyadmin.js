"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class FacultyAdmin extends Model {
    static associate(models) {
      FacultyAdmin.belongsTo(models.Faculty, { foreignKey: "facultyID" });
    }

    // Static method to find FacultyAdmin by Faculty ID
    static async findByFaculty(facultyID) {
      try {
        return await FacultyAdmin.findAll({
          where: { facultyID },
          include: [sequelize.models.Faculty],
        });
      } catch (error) {
        throw new Error(
          "Error finding FacultyAdmin by faculty: " + error.message
        );
      }
    }

    // Static method to create a new FacultyAdmin
    static async createFacultyAdmin(data) {
      try {
        return await FacultyAdmin.create(data);
      } catch (error) {
        throw new Error("Error creating FacultyAdmin: " + error.message);
      }
    }
  }

  FacultyAdmin.init(
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
        set(value) {
          this.setDataValue("name", value.trim());
        },
        get() {
          return this.getDataValue("name");
        },
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          this.setDataValue("surname", value.trim());
        },
        get() {
          return this.getDataValue("surname");
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
        set(value) {
          this.setDataValue("email", value.toLowerCase().trim());
        },
        get() {
          return this.getDataValue("email");
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
      tableName: "facultyAdmins",
      modelName: "FacultyAdmin",
    }
  );

  return FacultyAdmin;
};
