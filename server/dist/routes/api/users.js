"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _auth = _interopRequireDefault(require("../../auth/auth"));

var _users = _interopRequireDefault(require("../../controllers/users"));

var app = (0, _express.Router)();
app.post('/register', _users["default"].post.register);
app.post('/login', _users["default"].post.login);
app.post('/logout', _users["default"].post.logout);
app.put('/edit', _auth["default"], _users["default"].put.editAccount);
app["delete"]('/', _auth["default"], _users["default"].deletion.accountDelete);
app.get('/usernameandemail', _auth["default"], _users["default"].get.getUsernameAndEmail);
var _default = app;
exports["default"] = _default;