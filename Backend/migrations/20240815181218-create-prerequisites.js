"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("prerequisites", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      courseID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "courses", // Use the table name here
          key: "id",
        },
      },
      prerequisiteID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "courses", // Use the table name here
          key: "id",
        },
      },
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("prerequisites");
  },
};
