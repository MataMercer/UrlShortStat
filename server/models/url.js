'use strict';
module.exports = (sequelize, DataTypes) => {
  const Url = sequelize.define('Url', {
    originalUrl: DataTypes.TEXT,
    urlCode: {
      type: DataTypes.STRING,
      primaryKey: true
    }
  }, {});
  Url.associate = function(models) {
    models.Url.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Url;
};