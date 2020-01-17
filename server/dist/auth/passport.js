"use strict";

var bcrypt = require('bcryptjs');

var LocalStrategy = require('passport-local').Strategy;

var models = require('../models');

module.exports = function (passport) {
  // configure passport.js to use the local strategy
  passport.use(new LocalStrategy({
    usernameField: 'email'
  }, function (email, password, done) {
    models.User.findOne({
      where: {
        email: email
      }
    }).then(function (User) {
      if (User == null) {
        return done(null, false, {
          message: {
            message: 'Email or password is incorrect.'
          }
        });
      }

      bcrypt.compare(password, User.dataValues.password, function (err, isMatch) {
        if (err) throw err;

        if (isMatch) {
          return done(null, User);
        } else {
          return done(null, false, {
            message: {
              message: 'Email or password is incorrect.'
            }
          });
        }
      });
    })["catch"](function (error) {
      return done(error);
    });
  })); // tell passport how to serialize the user

  passport.serializeUser(function (user, done) {
    done(null, user.dataValues.id);
  });
  passport.deserializeUser(function (id, done) {
    models.User.findByPk(id).then(function (user) {
      done(null, user);
    });
  });
};