"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _models = _interopRequireDefault(require("../../models"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var UsersDeletions = {
  accountDelete: function accountDelete(req, res) {
    try {
      var userId = req.user.id;
      req.logout();

      _models["default"].User.findByPk(userId).then(function (user) {
        user.destroy();
        res.send({
          message: 'you have successfully deleted your account.'
        });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json('Server error');
    }
  }
};
var _default = UsersDeletions;
exports["default"] = _default;