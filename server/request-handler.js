var http = require('http');
var url = require('url');
var fs = require('fs');

/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var obj = { results: [] };

var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

var sendResponse = function (response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(obj));
};

var actions = {
  'GET': function(request, response) {
    var statusCode = 200;
    if (request.url !== '/classes/messages') {
      statusCode = 404;
    }
    sendResponse(response, obj, statusCode);
  },

  'POST': function(request, response) {
    var body = '';
    var message = '';

    request.on('data', (chunk) => {
      body += chunk;
    }).on('end', () => {
      message = JSON.parse(body);
      if (!message.username) {
        message.username = 'anonymous';
      }
      if (message.text) {
        obj.results.push(message);
      }
      sendResponse(response, obj, 201);
    });
  }
};

exports.requestHandler = function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  var action = actions[request.method];

  if (action) {
    action(request, response);
  } else {
    sendResponse(response, '', 404);
  }
};
