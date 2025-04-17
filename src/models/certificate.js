"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Certificate extends Model {
    static associate(models) {
      Certificate.belongsTo(models.User, { foreignKey: "userId", as: "user" }); 
      Certificate.belongsTo(models.Course, { foreignKey: "courseId", as: "course" }); 
    }
  }

  Certificate.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Courses", key: "id" },
      },
      certificateUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Certificate",
    }
  );

  return Certificate;
};
