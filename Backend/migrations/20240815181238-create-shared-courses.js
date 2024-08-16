"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("shared_courses", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      majorID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "majors",
          key: "id",
        },
      },
      courseID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "courses",
          key: "id",
        },
      },
      programmeID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "programmes",
          key: "id",
        },
      },
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("shared_courses");
  },
};
