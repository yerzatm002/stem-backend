'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ForumComment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ForumComment.init({
    topicId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'ForumComment',
  });

  ForumComment.associate = (models) => {
    ForumComment.belongsTo(models.ForumTopic, { foreignKey: "topicId" });
    ForumComment.belongsTo(models.User, { foreignKey: "userId" });
  };
  

  return ForumComment;
};