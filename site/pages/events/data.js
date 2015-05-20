var parser =  require('marky-mark');
var fs = require('fs');
var BASE_PATH = process.cwd() + '/site/markdowns/events/'

var Events = parser.parseDirectorySync(BASE_PATH);

module.exports = Events.map(function(item){	
	var attr = item.meta;
	var meetup = attr.meetup.split('/');

	var urlSafeTitle = attr.title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
	var itemReturner = attr;

	itemReturner['filename'] = 'events/'+urlSafeTitle;
	console.log(itemReturner.filename)
	itemReturner['meetup_namespace'] = meetup[0] +'/'+ meetup[1];
	itemReturner['event_id'] = meetup[2];
	itemReturner['description'] = attr.description.replace('\n', ' ');
	itemReturner['html'] = item.content;

	return itemReturner;
});


