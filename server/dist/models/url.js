'use strict';

module.exports = function (sequelize, DataTypes) {
  var Url = sequelize.define('Url', {
    originalUrl: DataTypes.TEXT,
    code: {
      type: DataTypes.STRING,
      primaryKey: true
    }
  }, {});

  Url.associate = function (models) {
    models.Url.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Url;
};