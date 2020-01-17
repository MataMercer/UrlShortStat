"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _users = _interopRequireDefault(require("./users"));

var _urls = _interopRequireDefault(require("./urls"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var api = (0, _express.Router)();
api.use("/user", _users["default"]);
api.use("/url", _urls["default"]);
var _default = api;
exports["default"] = _default;