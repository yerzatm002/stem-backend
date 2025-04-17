const app = require("./app");
const sequelize = require("./config/database");

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  console.log("✅ Database synced");
}).catch((err) => {
  console.error("❌ Database sync error:", err);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
