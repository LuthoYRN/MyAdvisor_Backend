"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("programmes", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      programmeName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      facultyID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "faculties",
          key: "id",
        },
      },
      coreElectiveCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("programmes");
  },
};
