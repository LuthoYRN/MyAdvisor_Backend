"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("advisorProgramme", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      advisorID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "advisor",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      programmeID: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "programme",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("advisorProgramme");
  },
};
