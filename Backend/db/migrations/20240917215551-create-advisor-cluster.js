"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("advisorCluster", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      seniorAdvisorID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "advisor", // Name of the table
          key: "id",
        },
      },
      advisorIDs: {
        type: Sequelize.ARRAY(Sequelize.INTEGER), // Store an array of advisor IDs
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("advisorCluster");
  },
};
