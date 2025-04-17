'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Test extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Test.init({
    courseId: DataTypes.INTEGER,
    moduleId: DataTypes.INTEGER,
    questions: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Test',
  });

  Test.associate = (models) => {
    Test.belongsTo(models.Course, { foreignKey: "courseId" });
    Test.belongsTo(models.Module, { foreignKey: "moduleId" });
    Test.hasMany(models.TestResult, { foreignKey: "testId", as: "results" });
  };
  

  return Test;
};