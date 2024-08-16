"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("majors", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      majorName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      departmentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "departments",
          key: "id",
        },
      },
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("majors");
  },
};
