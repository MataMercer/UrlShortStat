"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _get = _interopRequireDefault(require("./get"));

var _post = _interopRequireDefault(require("./post"));

var _put = _interopRequireDefault(require("./put"));

var _deletion = _interopRequireDefault(require("./deletion"));

//note deleting is used bc delete is a reserved word.
var usersRestControllers = {
  get: _get["default"],
  post: _post["default"],
  put: _put["default"],
  deletion: _deletion["default"]
};
var _default = usersRestControllers;
exports["default"] = _default;