"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _models = _interopRequireDefault(require("../../models"));

var UsersPuts = {
  editAccount: function editAccount(req, res) {
    var _req$body = req.body,
        name = _req$body.name,
        email = _req$body.email,
        password = _req$body.password,
        password2 = _req$body.password2;
    var errors = [];

    if (password) {
      //check passwords match
      if (password !== password2) {
        errors.push('Passwords do not match.');
      } //check pass length


      if (password.length < 6) {
        errors.push('Password should be at least 6 characters.');
      }
    }

    if (errors.length > 0) {
      return res.status(400).send({
        message: errors
      });
    } else {
      _models["default"].User.findOne({
        where: {
          email: email
        }
      }).then(function (user) {
        if (user) {
          errors.push('Email is already registered');
          return res.status(400).send({
            message: errors
          });
        } else {
          if (password) {
            bcrypt.genSalt(10, function (err, salt) {
              return bcrypt.hash(password, salt, function (err, hash) {
                if (err) throw err; //save user

                req.user.password = hash;

                if (email) {
                  req.user.email = email;
                }

                if (name) {
                  req.user.name = name;
                }

                req.user.save().then(function () {
                  return res.send({
                    message: 'you have successfully changed your account info.',
                    email: req.user.email,
                    name: req.user.name
                  });
                });
              });
            });
          } else {
            if (email) {
              req.user.email = email;
            }

            if (name) {
              req.user.name = name;
            }

            req.user.save().then(function () {
              return res.send({
                message: 'you have successfully changed your account info.',
                email: req.user.email,
                name: req.user.name
              });
            });
          }
        }
      });
    }
  }
};
var _default = UsersPuts;
exports["default"] = _default;