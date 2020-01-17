"use strict";

module.exports = {
  development: {
    username: "postgres",
    password: "password",
    database: "expresssessiontest",
    host: "192.168.1.155",
    dialect: "postgres",
    logging: false
  },
  test: {
    dialect: "sqlite",
    storage: ":memory:",
    logging: false
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: "postgres"
  }
};