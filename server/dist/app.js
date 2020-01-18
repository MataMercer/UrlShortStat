"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _v = _interopRequireDefault(require("uuid/v4"));

var _helmet = _interopRequireDefault(require("helmet"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _passport = _interopRequireDefault(require("passport"));

var _cors = _interopRequireDefault(require("cors"));

var _routes = _interopRequireDefault(require("./routes"));

//npm modules
require('./auth/passport')(_passport["default"]);

var SequelizeSessionStore = require('connect-session-sequelize')(_expressSession["default"].Store);

var models = require('./models');

//set db for sessions
var mySessionStore = new SequelizeSessionStore({
  db: models.sequelize
}); // create the server

var app = (0, _express["default"])();
app.use((0, _helmet["default"])());
app.use((0, _cors["default"])({
  credentials: true,
  origin: 'http://localhost:3000'
})); // add & configure middleware

app.use(_bodyParser["default"].urlencoded({
  extended: false
}));
app.use(_bodyParser["default"].json());
app.use((0, _expressSession["default"])({
  genid: function genid(req) {
    return (0, _v["default"])(); // use UUIDs for session IDs
  },
  store: mySessionStore,
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000
  } // 30 days

})); //create session tables

mySessionStore.sync();
app.use(_passport["default"].initialize());
app.use(_passport["default"].session());
app.use("/", _routes["default"]);
var _default = app;
exports["default"] = _default;