"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _models = _interopRequireDefault(require("../../models"));

var _validUrl = _interopRequireDefault(require("valid-url"));

var _shortid = _interopRequireDefault(require("shortid"));

var _sequelize = require("sequelize");

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var UrlsPosts = {
  createUrl: function createUrl(req, res) {
    var _req$body = req.body,
        originalUrl = _req$body.originalUrl,
        customUrl = _req$body.customUrl;

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
      var format;

      switch (timeSpan) {
        case 'month':
          lowerBoundDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - unitsBackInTime, 1); // first dday of month

          upperBoundDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - unitsBackInTime + 1, 1); //first of next month

          format = 'MM/DD/YYYY';
          break;

        case 'year':
          lowerBoundDate = new Date(currentDate.getFullYear() - unitsBackInTime, 0, 1);
          upperBoundDate = new Date(currentDate.getFullYear() + 1 - unitsBackInTime, 0, 1);
          format = 'MM/YYYY';
          break;

        default:
          //last 30 days
          upperBoundDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
          lowerBoundDate = new Date(upperBoundDate.getFullYear(), upperBoundDate.getMonth(), upperBoundDate.getDate() - 30);
          format = 'MM/DD/YYYY';
      }

      _models["default"].Visit.findAndCountAll({
        where: {
          UrlCode: code,
          createdAt: (_createdAt = {}, _defineProperty(_createdAt, _sequelize.Op.lt, upperBoundDate), _defineProperty(_createdAt, _sequelize.Op.gte, lowerBoundDate), _createdAt)
        }
      }).then(function (visits) {
        var cleanedVisits = visits.rows.map(function (visit) {
          return (0, _moment["default"])(visit.get('createdAt')).format(format);
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