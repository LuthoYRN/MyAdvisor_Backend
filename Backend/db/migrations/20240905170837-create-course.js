"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("course", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      courseName: {
        type: Sequelize.STRING,
      },
      credits: {
        type: Sequelize.INTEGER,
      },
      nqf_level: {
        type: Sequelize.INTEGER,
      },
      prerequisites: {
        type: Sequelize.ARRAY(Sequelize.STRING), // Storing prerequisites as array
      },
      equivalents: {
        type: Sequelize.ARRAY(Sequelize.STRING), // Storing equivalents as array
      },
      specialRequirements: {
        type: Sequelize.STRING,
      },
      bothSemesters: {
        type: Sequelize.BOOLEAN,
      },
      facultyID: {
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("course");
  },
};
