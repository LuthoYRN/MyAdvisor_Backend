"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("advisors", {
      uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      surname: { type: DataTypes.STRING, allowNull: false },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      office_location: { type: DataTypes.STRING },
      advisor_level: { type: DataTypes.STRING },
      departmentID: {
        type: DataTypes.INTEGER,
        references: {
          model: "departments",
          key: "id",
        },
        allowNull: false,
      },
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("advisors");
  },
};
