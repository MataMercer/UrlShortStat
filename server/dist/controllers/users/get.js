"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _models = _interopRequireDefault(require("../../models"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var UsersGets = {
  getUsernameAndEmail: function getUsernameAndEmail(req, res) {
    try {
      res.send({
        email: req.user.dataValues.email,
        name: req.user.dataValues.name
      });
    } catch (err) {
      console.error(err);
      res.status(500).json('Server error');
    }
  },
  shortUrlRedirect: function shortUrlRedirect(req, res) {
    // console.log(req);
    try {
      _models["default"].Url.findByPk(req.params.code).then(function (url) {
        if (url) {
          try {
            _models["default"].Visit.create({
              UrlCode: req.params.code
            });
          } catch (err) {
            console.log(err);
          }

          return res.redirect(url.dataValues.originalUrl);
        } else {
          return res.status(404).json('No url found');
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json('Server error');
    }
  }
};
var _default = UsersGets;
exports["default"] = _default;