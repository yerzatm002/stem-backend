'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TestResult extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TestResult.init({
    userId: DataTypes.INTEGER,
    testId: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
    answers: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'TestResult',
  });

  TestResult.associate = (models) => {
    TestResult.belongsTo(models.User, { foreignKey: "userId" });
    TestResult.belongsTo(models.Test, { foreignKey: "testId" });
  };
  

  return TestResult;
};