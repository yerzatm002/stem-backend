'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lesson extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Lesson.init({
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    moduleId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Lesson',
  });

  Lesson.associate = (models) => {
    Lesson.belongsTo(models.Module, { foreignKey: "moduleId" });
  };
  

  return Lesson;
};