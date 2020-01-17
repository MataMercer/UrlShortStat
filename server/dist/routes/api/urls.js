"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _auth = _interopRequireDefault(require("../../auth/auth"));

var _urls = _interopRequireDefault(require("../../controllers/urls"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// const express = require('express');
// const router = express.Router();
// var models = require('../../models');
// const { ensureAuthenticated } = require('../../auth/auth');
// const validUrl = require('valid-url');
// const shortid = require('shortid');
// const config = require('config');
// const Sequelize = require('sequelize');
// const Op = Sequelize.Op;
// const moment = require('moment');
var app = (0, _express.Router)();
app.post('/create', _auth["default"], _urls["default"].post.createUrl);
app.put('/edit', _auth["default"], _urls["default"].put.editUrl);
app.get('/', _auth["default"], _urls["default"].get.allUrls);
app["delete"]('/:code', _auth["default"], _urls["default"].deletion.urlDelete);
app.post('/analytics', _auth["default"], _urls["default"].post.analyze);
var _default = app;
exports["default"] = _default;