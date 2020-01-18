"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _users = _interopRequireDefault(require("./users"));

var _urls = _interopRequireDefault(require("./urls"));

var api = (0, _express.Router)();
api.use("/user", _users["default"]);
api.use("/url", _urls["default"]);
var _default = api;
exports["default"] = _default;