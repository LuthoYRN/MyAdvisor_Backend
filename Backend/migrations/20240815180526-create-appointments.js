"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("appointments", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      studentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "students", // References the students table
          key: "id",
        },
      },
      advisorID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "advisors", // References the advisors table
          key: "id",
        },
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      comment: {
        type: DataTypes.STRING,
      },
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("appointments");
  },
};
