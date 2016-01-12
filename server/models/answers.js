'use strict';
module.exports = function(sequelize, DataTypes) {
  var Answers = sequelize.define('Answers', {
    UserId: DataTypes.INTEGER,
    QuestionId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Answers;
};