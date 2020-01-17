"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _models = _interopRequireDefault(require("../../models"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var UrlsGets = {
  allUrls: function allUrls(req, res) {
    try {
      _models["default"].Url.findAndCountAll({
        where: {
          UserId: req.user.dataValues.id
        }
      }).then(function (result) {
        res.send({
          count: result.count,
          urls: result.rows
        });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json('Server error');
    }
  }
};
var _default = UrlsGets;
exports["default"] = _default;