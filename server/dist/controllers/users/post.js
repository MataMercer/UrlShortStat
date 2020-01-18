"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _models = _interopRequireDefault(require("../../models"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _passport = _interopRequireDefault(require("passport"));

var UsersPosts = {
  register: function register(req, res) {
    var _req$body = req.body,
        name = _req$body.name,
        email = _req$body.email,
        password = _req$body.password,
        password2 = _req$body.password2;
    var errors = []; //check required fields

    if (!name || !email || !password || !password2 || name == undefined || email == undefined || password == undefined || password2 == undefined) {
      errors.push('Please fill in all fields.');
      return res.status(400).send({
        message: errors
      });
    } //check passwords match


    if (password !== password2) {
      errors.push('Passwords do not match.');
    } //check pass length


    if (password.length < 6) {
      errors.push('Password should be at least 6 characters.');
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
          _bcryptjs["default"].genSalt(10, function (err, salt) {
            return _bcryptjs["default"].hash(password, salt, function (err, hash) {
              if (err) throw err; //save user

              _models["default"].User.create({
                name: name,
                email: email,
                password: hash
              }).then(function (user) {
                req.login(user, function (err) {
                  if (err) {
                    console.log(err);
                    return res.status(500).send({
                      message: err
                    });
                  }

                  return res.send({
                    message: 'you have successfully registered.',
                    email: email,
                    name: name
                  });
                });
              });
            });
          });
        }
      });
    }
  },
  login: function login(req, res, next) {
    _passport["default"].authenticate('local', function (err, user, info) {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(400).send(info.message);
      }

      req.login(user, function (err) {
        if (err) {
          return next(err);
        }

        return res.send({
          message: 'you have logged in.',
          email: user.dataValues.email,
          name: user.dataValues.name
        });
      });
    })(req, res, next);
  },
  logout: function logout(req, res) {
    req.logout();
    return res.send({
      message: 'you have logged out.'
    });
  }
};
var _default = UsersPosts;
exports["default"] = _default;