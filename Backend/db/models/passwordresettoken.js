"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PasswordResetToken extends Model {
    static associate(models) {}
  }
  PasswordResetToken.init(
    {
      userUUID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      resetToken: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiration: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "passwordResetToken",
      tableName: "passwordResetToken",
      freezeTableName: true,
      timestamps: true,
    }
  );
  return PasswordResetToken;
};
