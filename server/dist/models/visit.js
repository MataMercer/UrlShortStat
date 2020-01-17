'use strict';

module.exports = function (sequelize, DataTypes) {
  var Visit = sequelize.define('Visit', {}, {});

  Visit.associate = function (models) {
    models.Visit.belongsTo(models.Url, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Visit;
};