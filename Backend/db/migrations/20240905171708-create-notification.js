"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("notification", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.STRING,
      },
      appointmentID: {
        type: Sequelize.INTEGER,
      },
      studentID: {
        type: Sequelize.INTEGER,
      },
      timestamp: {
        type: Sequelize.DATE,
        defaultValue: DataTypes.NOW,
      },
      comment: {
        type: Sequelize.STRING,
      },
      read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("notification");
  },
};
