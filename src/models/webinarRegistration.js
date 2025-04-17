"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class WebinarRegistration extends Model {
    static associate(models) {
      WebinarRegistration.belongsTo(models.Webinar, { foreignKey: "webinarId", as: "webinar" });
      WebinarRegistration.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    }
  }

  WebinarRegistration.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      webinarId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "WebinarRegistration",
    }
  );

  return WebinarRegistration;
};
