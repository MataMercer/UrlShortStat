"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _models = _interopRequireDefault(require("../../models"));

var _validUrl = _interopRequireDefault(require("valid-url"));

var UrlsPuts = {
  editUrl: function editUrl(req, res) {
    var _req$body = req.body,
        originalUrl = _req$body.originalUrl,
        code = _req$body.code;

    if (_validUrl["default"].isUri(originalUrl)) {
      try {
        if (code) {
          _models["default"].Url.findByPk(code).then(function (url) {
            if (url) {
              if (url.get('UserId') === req.user.dataValues.id) {
                _models["default"].Url.update({
                  originalUrl: originalUrl
                }
                /* set attributes' value */
                , {
                  where: {
                    code: code
                  }
                }).then(function () {
                  return res.send({
                    message: 'you have successfully edited the url.',
                    code: code,
                    originalUrl: originalUrl
                  });
                });
              } else {
                return res.status(403).json('Forbidden access');
              }
            } else {
              return res.status(404).json('No url found');
            }
          });
        } else {
          return res.status(400).send({
            message: 'No code was provided.'
          });
        }
      } catch (error) {
        console.log(error);
        res.status(500).send({
          message: 'Server error.',
          error: error
        });
      }
    } else {
      res.status(400).send({
        message: 'Invalid long url. Make sure it starts with http:// or https://'
      });
    }
  }
};
var _default = UrlsPuts;
exports["default"] = _default;