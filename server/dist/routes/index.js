"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _api = _interopRequireDefault(require("./api"));

var _express = _interopRequireWildcard(require("express"));

var _users = _interopRequireDefault(require("../controllers/users"));

var _auth = _interopRequireDefault(require("../auth/auth"));

var path = require('path');

var app = (0, _express.Router)(); // define all routes here.

app.use('/api', _api["default"]); //short url redirector

app.get('/u/:code', _users["default"].get.shortUrlRedirect); // Serve static assets if in production

if (process.env.NODE_ENV === 'production') {
  //Set static folder
  app.use(_express["default"]["static"]('./../../client/build'));
  app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, '..', '..', 'client', 'build', 'index.html'));
  });
}

app.get('/authrequired', _auth["default"], function (req, res) {
  res.send('Auth endpoint reached!');
});
var _default = app;
exports["default"] = _default;