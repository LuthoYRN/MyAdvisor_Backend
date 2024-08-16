"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("advice_records", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      appointmentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "appointments",
          key: "id",
        },
      },
      createdAt: { type: DataTypes.TIME, defaultValue: DataTypes.NOW },
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("advice_records");
  },
};
