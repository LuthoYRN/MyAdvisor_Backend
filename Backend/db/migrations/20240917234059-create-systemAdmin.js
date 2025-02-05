"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("systemAdmin", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      surname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Ensures no duplicate emails
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("systemAdmin");
  },
};
