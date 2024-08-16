"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("students", {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      yearOfStudy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      programmeID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "programmes",
          key: "id",
        },
      },
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("students");
  },
};
