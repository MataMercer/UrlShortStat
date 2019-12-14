var moment = require('moment');
var timeFormat = 'MM/DD/YYYY';
moment().format();
console.log(moment('2019-12-07 22:59:15.147+00').format(timeFormat));