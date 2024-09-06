"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("availability", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      date: {
        type: Sequelize.DATEONLY,
      },
      time: {
        type: Sequelize.TIME,
      },
      advisorID: {
        type: Sequelize.INTEGER,
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("availability");
  },
};
