const port = 3000;
const app = require("./app");
const { sequelize } = require("./models");

app.listen(port, "127.0.0.1", async () => {
  console.log(`Server is running on port ${port}`);
  await sequelize.authenticate();
  console.log("Database connected!");
});
