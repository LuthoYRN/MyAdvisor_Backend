"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("faculty", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      facultyName: {
        type: Sequelize.STRING,
      },
      curriculumType: {
        type: Sequelize.ENUM("Major", "Programme"), // Define the enum values
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("faculty");
  },
};
