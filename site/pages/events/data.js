var RSVP = require('rsvp');
var parser =  require('marky-mark');
var fs = require('fs');
var meetup = require('./meetup-api');

var BASE_PATH = process.cwd() + '/site/markdowns/events/'

var Events = parser.parseDirectorySync(BASE_PATH);



module.exports = RSVP.all(Events.map(function(item){
	var attrs = item.meta;
	var filePath = BASE_PATH + item.filename + '.md';
	attrs['html'] = item.content;
	return meetup(attrs, filePath);
}));
