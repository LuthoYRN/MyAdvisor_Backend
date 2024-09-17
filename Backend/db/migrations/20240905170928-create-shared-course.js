"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("sharedCourse", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      majorID: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      courseID: {
        type: Sequelize.STRING,
      },
      programmeID: {
        allowNull: true,
        type: Sequelize.STRING,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("sharedCourse");
  },
};
