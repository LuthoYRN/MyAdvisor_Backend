require("dotenv").config({ path: `${process.cwd()}/.env` });
const app = require("./app");
const PORT = process.env.APP_PORT || 4000;
app.listen(PORT, "127.0.0.1", async () => {
  console.log(`Server is running on port ${PORT}`);
});
