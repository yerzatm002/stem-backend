"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Webinar extends Model {
    static associate(models) {
      Webinar.belongsTo(models.User, { foreignKey: "instructorId", as: "instructor" });
      Webinar.hasMany(models.WebinarRegistration, { foreignKey: "webinarId", as: "registrations" });
    }
  }

  Webinar.init(
    {
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      date: { type: DataTypes.DATE, allowNull: false },
      link: { type: DataTypes.STRING, allowNull: false },
      instructorId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "Webinar",
    }
  );

  return Webinar;
};
