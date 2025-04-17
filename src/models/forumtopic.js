'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ForumTopic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ForumTopic.init({
    title: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'ForumTopic',
  });

  ForumTopic.associate = (models) => {
    ForumTopic.belongsTo(models.User, { foreignKey: "userId" });
    ForumTopic.hasMany(models.ForumComment, { foreignKey: "topicId", as: "comments" });
  };
  

  return ForumTopic;
};