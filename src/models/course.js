'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Course.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    instructorId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Course',
  });

  Course.associate = (models) => {
    Course.belongsTo(models.User, { foreignKey: "instructorId", as: "instructor" });
    Course.hasMany(models.Module, { foreignKey: "courseId", as: "modules" });
    Course.hasMany(models.Test, { foreignKey: "courseId", as: "tests" });
    Course.hasMany(models.Certificate, { foreignKey: "courseId", as: "certificates" });
  };
  
  return Course;
};