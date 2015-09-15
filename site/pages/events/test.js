"use strict";

var moment = require('moment');
var tz = require('moment-timezone');


var test = moment.tz('2015-09-21 09:30', 'Europe/Berlin');
console.log(test.unix());
console.log(test.format());
console.log(test.format('MMMM DD, YYYY; HH:mm'));
console.log(test.tz('Europe/London').format());
console.log(test.tz('Europe/London').format());

