"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("courses", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      courseName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      credits: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nqf_level: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("courses");
  },
};
