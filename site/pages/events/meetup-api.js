"use strict";

var request = require('request');
var RSVP = require('rsvp');
var moment = require('moment');
var tz = require('moment-timezone');
var fs = require('fs');

var MEETUP_API_KEY = '<insert here>';
var MEETUP_API = 'https://api.meetup.com';
var MEETUP_GROUP_ID = '10644622';
var MEETUP_GROUP_URL = 'EuregioTechMeetup';
var TIMEZONE = 'Europe/Berlin';

var wrapApi = function(endpoint){
  return MEETUP_API + endpoint + '?key=' + MEETUP_API_KEY;
}

var updateEventId = function(filePath, eventId){
  // read markup file and update with meetup id
  var content = fs.readFileSync(filePath)
                  .toString()
                  .split('---\n');

  content = '---\n'
            + content[1]
            + 'meetup: ' + MEETUP_GROUP_URL + '/events/' + eventId + '\n'
            + '---\n'
            + content[2] ;

  console.log('writing to filePath', filePath, ':');
  console.log(content);

  fs.writeFileSync(filePath, content);
}

var createEvent = function(attrs, filePath){
  var url = wrapApi('/2/event');

  //time should be in milliseconds and moment uses seconds.
  var time = attrs.time.tz('UTC').unix() * 1000
  var options = {
    url: url,
    form: {
      group_id: MEETUP_GROUP_ID,
      group_urlname: MEETUP_GROUP_URL,
      time: time,
      name: attrs.title,
      status: 'draft',
      description: attrs.html,
    }
  };

  return new RSVP.Promise(function(resolve, reject){
    request.post(options, function(err, resp, body){
      //201 Created
      if (!err && resp.statusCode === 201){
        attrs['event_id'] = JSON.parse(body).id;
        updateEventId(filePath, attrs['event_id']);
        resolve(attrs);
      }
      else {
        reject(err, resp, body);
      }
    });
  });
}

var parseEventData = function(attrs, filename){
  var urlSafeTitle = attrs.title.replace(/([^a-z0-9]|-)+/gi, '-').toLowerCase();
  attrs['filename'] = 'events/' + urlSafeTitle;
	attrs['description'] = attrs.description.replace('\n', ' ');
  attrs['meetup_namespace'] = MEETUP_GROUP_URL + '/events';
  attrs['time'] = moment.tz(attrs['when'], 'YYYY-MM-DD HH:mm', TIMEZONE);
  attrs['when'] = attrs['time'].format('MMMM DD, YYYY; HH:mm');

  var meetup = attrs['meetup'];

  if (meetup){
    attrs['event_id'] = meetup.split('/')[2];
    return new RSVP.Promise(function(resolve, reject){
      resolve(attrs);
    });
  } else {
    console.log('creating new event');
    return createEvent(attrs, filename);
  }
}

module.exports = parseEventData;
