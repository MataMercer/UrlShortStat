"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _api = _interopRequireDefault(require("./api"));

var _express = require("express");

var _users = _interopRequireDefault(require("../controllers/users"));

var _auth = _interopRequireDefault(require("../auth/auth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express.Router)(); // define all routes here.

app.use('/api', _api["default"]); //short url redirector

app.get('/u/:code', _users["default"].get.shortUrlRedirect); // Serve static assets if in production

if (process.env.NODE_ENV === 'production') {
  //Set static folder
  app.use(express["static"]('./client/build'));
  app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.get('/authrequired', _auth["default"], function (req, res) {
  res.send('Auth endpoint reached!');
});
var _default = app;
exports["default"] = _default;