const { Sequelize } = require("sequelize");
const config = require("../config/config.json")[process.env.NODE_ENV || "development"];

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

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Импортируем модели
db.User = require("./user")(sequelize, Sequelize);
db.Course = require("./course")(sequelize, Sequelize);
db.Module = require("./module")(sequelize, Sequelize);
db.Lesson = require("./lesson")(sequelize, Sequelize);
db.Test = require("./test")(sequelize, Sequelize);
db.TestResult = require("./testresult")(sequelize, Sequelize);
db.Certificate = require("./certificate")(sequelize, Sequelize);
db.ForumTopic = require("./forumtopic")(sequelize, Sequelize);
db.ForumComment = require("./forumcomment")(sequelize, Sequelize);
db.Webinar = require("./webinar")(sequelize, Sequelize.DataTypes);
db.WebinarRegistration = require("./webinarRegistration")(sequelize, Sequelize.DataTypes);

// Связи между моделями
db.User.hasMany(db.Course, { foreignKey: "instructorId", as: "courses" });
db.Course.belongsTo(db.User, { foreignKey: "instructorId", as: "instructor" });

db.Course.hasMany(db.Module, { foreignKey: "courseId", as: "modules" });
db.Module.belongsTo(db.Course, { foreignKey: "courseId" });

db.Module.hasMany(db.Lesson, { foreignKey: "moduleId", as: "lessons" });
db.Lesson.belongsTo(db.Module, { foreignKey: "moduleId" });

db.Course.hasMany(db.Test, { foreignKey: "courseId", as: "tests" });
db.Module.hasMany(db.Test, { foreignKey: "moduleId", as: "tests" });
db.Test.belongsTo(db.Course, { foreignKey: "courseId" });
db.Test.belongsTo(db.Module, { foreignKey: "moduleId" });

db.User.hasMany(db.TestResult, { foreignKey: "userId", as: "testResults" });
db.TestResult.belongsTo(db.User, { foreignKey: "userId" });

db.Test.hasMany(db.TestResult, { foreignKey: "testId", as: "results" });
db.TestResult.belongsTo(db.Test, { foreignKey: "testId" });

db.User.hasMany(db.Certificate, { foreignKey: "userId", as: "certificates" });
db.Certificate.belongsTo(db.User, { foreignKey: "userId" });

db.Course.hasMany(db.Certificate, { foreignKey: "courseId", as: "certificates" });
db.Certificate.belongsTo(db.Course, { foreignKey: "courseId" });

db.User.hasMany(db.ForumTopic, { foreignKey: "userId", as: "topics" });
db.ForumTopic.belongsTo(db.User, { foreignKey: "userId" });

db.ForumTopic.hasMany(db.ForumComment, { foreignKey: "topicId", as: "comments" });
db.ForumComment.belongsTo(db.ForumTopic, { foreignKey: "topicId" });

db.User.hasMany(db.ForumComment, { foreignKey: "userId", as: "comments" });
db.ForumComment.belongsTo(db.User, { foreignKey: "userId" });

module.exports = db;
