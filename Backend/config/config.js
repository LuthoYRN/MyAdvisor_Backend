require("dotenv").config({ path: `${process.cwd()}/.env` });

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
  },
  test: {
    username: process.env.DB_CLOUD_USERNAME,
    password: process.env.DB_CLOUD_PASSWORD,
    database: process.env.DB_CLOUD_NAME,
    host: process.env.DB_CLOUD_HOST,
    port: process.env.DB_CLOUD_PORT,
    dialect: "postgres",
  },
  production: {
    username: process.env.DB_CLOUD_USERNAME,
    password: process.env.DB_CLOUD_PASSWORD,
    database: process.env.DB_CLOUD_NAME,
    host: process.env.DB_CLOUD_HOST,
    port: process.env.DB_CLOUD_PORT,
    dialect: "postgres",
  },
};
