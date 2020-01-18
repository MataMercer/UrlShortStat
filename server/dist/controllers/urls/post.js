"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _models = _interopRequireDefault(require("../../models"));

var _validUrl = _interopRequireDefault(require("valid-url"));

var _shortid = _interopRequireDefault(require("shortid"));

var _sequelize = require("sequelize");

var _moment = _interopRequireDefault(require("moment"));

var UrlsPosts = {
  createUrl: function createUrl(req, res) {
    var _req$body = req.body,
        originalUrl = _req$body.originalUrl,
        code = _req$body.code;
    var customUrl = code;
    console.log(customUrl);
    console.log(originalUrl);

    if (_validUrl["default"].isUri(originalUrl)) {
      try {
        if (customUrl) {
          _models["default"].Url.findOne({
            where: {
              code: customUrl
            }
          }).then(function (url) {
            if (url) {
              return res.status(400).send({
                message: 'That custom URL code is already taken. Please try again.'
              });
            } else {
              if (customUrl) {
                _models["default"].Url.create({
                  originalUrl: originalUrl,
                  code: customUrl,
                  UserId: req.user.dataValues.id
                }).then(function () {
                  return res.send({
                    message: 'you have successfully registered a new url.',
                    code: customUrl,
                    originalUrl: originalUrl
                  });
                });
              }
            }
          });
        } else {
          var newCode = _shortid["default"].generate();

          _models["default"].Url.findOne({
            where: {
              code: newCode
            }
          }).then(function (url) {
            if (!url) {
              _models["default"].Url.create({
                originalUrl: originalUrl,
                code: newCode,
                UserId: req.user.dataValues.id
              }).then(function () {
                return res.send({
                  message: 'you have successfully registered a new url.',
                  code: newCode,
                  originalUrl: originalUrl
                });
              });
            } else {
              return res.status(500).send({
                message: 'Try resubmitting. Server had trouble generating a unique ID.'
              });
            }
          });
        }
      } catch (error) {
        console.log(error);
        res.status(500).send({
          message: 'Server error.'
        });
      }
    } else {
      res.status(400).send({
        message: 'Invalid long url. Make sure it starts with http:// or https://'
      });
    }
  },
  //this under post bc get doesnt allow json attachments
  analyze: function analyze(req, res) {
    try {
      var _createdAt;

      var _req$body2 = req.body,
          timeSpan = _req$body2.timeSpan,
          unitsBackInTime = _req$body2.unitsBackInTime,
          code = _req$body2.code,
          date = _req$body2.date;
      var currentDate = date ? new Date(date) : new Date();
      var lowerBoundDate;
      var upperBoundDate;

      switch (timeSpan) {
        case 'month':
          lowerBoundDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - unitsBackInTime, 1); // first dday of month

          upperBoundDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - unitsBackInTime + 1, 1); //first of next month

          break;

        case 'year':
          lowerBoundDate = new Date(currentDate.getFullYear() - unitsBackInTime, 0, 1);
          upperBoundDate = new Date(currentDate.getFullYear() + 1 - unitsBackInTime, 0, 1);
          break;

        default:
          //last 30 days
          upperBoundDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1 - 30 * unitsBackInTime);
          lowerBoundDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 30 * (unitsBackInTime + 1));
      }

      _models["default"].Visit.findAndCountAll({
        where: {
          UrlCode: code,
          createdAt: (_createdAt = {}, (0, _defineProperty2["default"])(_createdAt, _sequelize.Op.lt, upperBoundDate), (0, _defineProperty2["default"])(_createdAt, _sequelize.Op.gte, lowerBoundDate), _createdAt)
        }
      }).then(function (visits) {
        var cleanedVisits = visits.rows.map(function (visit) {
          //convert visits to a date with just year, month, and day. no hours.
          if (timeSpan === 'year') {
            return new Date(visit.get('createdAt').getFullYear(), visit.get('createdAt').getMonth(), 1).toJSON();
          } else {
            return new Date(visit.get('createdAt').getFullYear(), visit.get('createdAt').getMonth(), visit.get('createdAt').getDate()).toJSON();
          }
        });
        var dateToVisitCount = {};

        for (var i = 0; i < cleanedVisits.length; i++) {
          if (cleanedVisits[i] in dateToVisitCount === false) {
            dateToVisitCount[cleanedVisits[i]] = 1;
          } else {
            dateToVisitCount[cleanedVisits[i]] = dateToVisitCount[cleanedVisits[i]] + 1;
          }
        }

        _models["default"].Visit.count({
          where: {
            UrlCode: code
          }
        }).then(function (count) {
          return res.send({
            dataPoints: dateToVisitCount,
            timeSpanVisitCount: visits.count,
            totalVisitCount: count
          });
        });
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json('Server error');
    }
  }
};
var _default = UrlsPosts;
exports["default"] = _default;