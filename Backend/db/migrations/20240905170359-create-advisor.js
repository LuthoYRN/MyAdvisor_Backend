"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("advisor", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      surname: {
        type: Sequelize.STRING,
      },
      email: {
        unique: true,
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      office: {
        type: Sequelize.STRING,
      },
      advisor_level: {
        type: Sequelize.STRING,
      },
      profile_url: {
        type: Sequelize.STRING,
      },
      clusterID: {
        type: Sequelize.INTEGER,
        allowNull: true, // Allowing null in case an advisor is not assigned to a cluster
        references: {
          model: "advisorCluster",
          key: "id",
        },
      },
      facultyID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "faculty", // Name of the faculty table
          key: "id", // Reference key in the faculty table
        },
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("advisor");
  },
};
