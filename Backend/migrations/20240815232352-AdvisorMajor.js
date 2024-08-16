"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("advisors_majors", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      advisorID: {
        type: DataTypes.INTEGER,
        references: {
          model: "advisors",
          key: "id",
        },
      },
      majorID: {
        type: DataTypes.INTEGER,
        references: {
          model: "majors",
          key: "id",
        },
      },
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("advisors_majors");
  },
};
