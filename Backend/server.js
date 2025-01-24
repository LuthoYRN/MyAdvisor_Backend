require("dotenv").config({ path: `${process.cwd()}/.env` });
const { sequelize } = require("./db/models");
const app = require("./app");

const PORT = process.env.APP_PORT || 4000;
const HOST = "0.0.0.0"; // Allows access from anywhere

app.listen(PORT, HOST, async () => {
  try {
    console.log(`Server is running on ${HOST}:${PORT}`);
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL successfully!");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
