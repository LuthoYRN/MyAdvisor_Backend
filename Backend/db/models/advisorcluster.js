"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AdvisorCluster extends Model {
    static associate(models) {
      AdvisorCluster.hasMany(models.advisor, { foreignKey: "clusterID" });
    }
  }

  AdvisorCluster.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      seniorAdvisorID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "advisor",
          key: "id",
        },
      },
      advisorIDs: {
        type: DataTypes.ARRAY(DataTypes.INTEGER), // Store an array of advisor IDs
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "advisorCluster",
      freezeTableName: true,
      timestamps: false,
    }
  );

  return AdvisorCluster;
};
