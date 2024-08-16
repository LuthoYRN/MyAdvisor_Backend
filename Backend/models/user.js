const { Model, DataTypes } = require("sequelize");

class User extends Model {
  static initBaseFields() {
    return {
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
        set(value) {
          this.setDataValue("name", value.trim());
        },
        get() {
          return this.getDataValue("name");
        },
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          this.setDataValue("surname", value.trim());
        },
        get() {
          return this.getDataValue("surname");
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
        set(value) {
          if (!/\S+@\S+\.\S+/.test(value)) {
            throw new Error("Invalid email address");
          }
          this.setDataValue("email", value.toLowerCase().trim());
        },
        get() {
          return this.getDataValue("email");
        },
      },
    };
  }
}

module.exports = User;
