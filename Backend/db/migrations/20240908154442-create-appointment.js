"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("appointment", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      studentID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "student", // references student table
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      advisorID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "advisor", // references advisor table
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("Pending", "Confirmed", "Rejected"),
        defaultValue: "Pending",
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("appointment");
  },
};
