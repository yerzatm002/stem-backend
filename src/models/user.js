const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Course, { foreignKey: "instructorId", as: "courses" });
      User.hasMany(models.Certificate, { foreignKey: "userId", as: "certificates" }); // ✅ alias "certificates"
      User.hasMany(models.TestResult, { foreignKey: "userId", as: "testResults" });
      User.hasMany(models.ForumTopic, { foreignKey: "userId", as: "topics" });
      User.hasMany(models.ForumComment, { foreignKey: "userId", as: "comments" });
    }
  }

  User.init(
    {
      uid: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "user",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      photo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      completedCourses: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
      },
    }
  );

  return User;
};
