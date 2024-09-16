"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class advisorProgramme extends Model {
    static associate(models) {
      // No direct associations needed since this is a join table
      this.belongsTo(models.advisor, {
        foreignKey: "advisorID",
      });
      this.belongsTo(models.programme, {
        foreignKey: "programmeID",
      });
    }
  }

  advisorProgramme.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      advisorID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "advisor",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      programmeID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "programme",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "advisorProgramme",
      freezeTableName: true,
      timestamps: false,
    }
  );

  return advisorProgramme;
};
