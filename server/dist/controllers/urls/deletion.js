"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _models = _interopRequireDefault(require("../../models"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var UrlsDeletions = {
  urlDelete: function urlDelete(req, res) {
    try {
      _models["default"].Url.findByPk(req.params.code).then(function (url) {
        if (url) {
          if (url.get('UserId') === req.user.dataValues.id) {
            url.destroy();
            return res.json('url deleted');
          } else {
            return res.status(403).json('Forbidden access');
          }
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
var _default = UrlsDeletions;
exports["default"] = _default;