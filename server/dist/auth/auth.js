"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).send({
      message: "Unauthorized request. Please login."
    });
  }
};

var _default = ensureAuthenticated;
exports["default"] = _default;