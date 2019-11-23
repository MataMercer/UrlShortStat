'use strict';
module.exports = (sequelize, DataTypes) => {
  const Url = sequelize.define('Url', {
    originalUrl: DataTypes.STRING,
    urlCode: DataTypes.STRING
  }, {});
  Url.associate = function(models) {
    // associations can be defined here
  };
  return Url;
};