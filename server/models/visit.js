'use strict';
module.exports = (sequelize, DataTypes) => {
  const Visit = sequelize.define('Visit', {

  }, {});
  Visit.associate = function(models) {
    models.Visit.belongsTo(models.Url, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Visit;
};