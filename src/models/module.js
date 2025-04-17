'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Module extends Model {
    /**
     * Определение связей между таблицами
     */
    static associate(models) {
      Module.belongsTo(models.Course, { foreignKey: "courseId" });
      Module.hasMany(models.Lesson, { foreignKey: "moduleId", as: "lessons" });
      Module.hasMany(models.Test, { foreignKey: "moduleId", as: "tests" });
    }
  }

  Module.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Courses", key: "id" },
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: true, // Может быть пустым, если у модуля нет видео
      validate: {
        isUrl: true,
      },
    },
    materialsUrl: {
      type: DataTypes.STRING,
      allowNull: true, // Может быть пустым, если нет дополнительных материалов
      validate: {
        isUrl: true,
      },
    },
  }, {
    sequelize,
    modelName: "Module",
  });

  return Module;
};
