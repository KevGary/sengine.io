'use strict';
module.exports = function(sequelize, DataTypes) {
  var Questions = sequelize.define('Questions', {
    UserId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Questions;
};