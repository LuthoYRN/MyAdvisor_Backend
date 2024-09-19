"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("programme", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      prefix: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [["BBusSci", "BCom", "BscEng", "BSc", "BAS"]],
        },
      },
      programmeName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      electiveCreditCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      departmentID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "department",
          key: "id",
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("programme");
  },
};
