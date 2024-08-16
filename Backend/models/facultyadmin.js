"use strict";
const User = require("./User");

module.exports = (sequelize, DataTypes) => {
  class FacultyAdmin extends User {
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
      ...User.initBaseFields(), // Inherit fields from User
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
