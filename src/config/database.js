const { Sequelize } = require("sequelize");
const config = require("./config.json")[process.env.NODE_ENV || "development"];

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});
;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
})();

module.exports = sequelize;
