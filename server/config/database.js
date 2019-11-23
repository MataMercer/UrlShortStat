const Sequelize = require('sequelize');

module.exports =  new Sequelize('expresssessiontest', 'postgres', 'password', {
  host: '192.168.1.155',
  dialect: 'postgres',
  port: 5432,
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});