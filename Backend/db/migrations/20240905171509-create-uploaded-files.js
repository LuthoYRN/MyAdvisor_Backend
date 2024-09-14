"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("uploadedFile", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      appointmentID: {
        type: Sequelize.INTEGER,
      },
      fileName: {
        type: Sequelize.STRING,
      },
      filePathURL: {
        type: Sequelize.STRING,
      },
      uploadedBy: {
        type: Sequelize.ENUM("student", "advisor"), // New column to differentiate
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("uploadedFile");
  },
};
