"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _models = _interopRequireDefault(require("../../models"));

var UrlsDeletions = {
  urlDelete: function urlDelete(req, res) {
    try {
      _models["default"].Url.findByPk(req.params.code).then(function (url) {
        if (url) {
          if (url.get('UserId') === req.user.dataValues.id) {
            url.destroy();
            return res.send({
              message: 'you have successfully deleted the url.',
              code: req.params.code
            });
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