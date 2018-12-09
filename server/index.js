//The main program - brings everything together

//Imports classes
var webserver = require('./webserver');
var robot = require('./robot');

// INIT ROBOT - Make instance of robot
var robot1 = new robot({
  // comPort: "COM3", // TODO: If we ever wanted to instantiate multiple Arduinos on different COM ports
  //Specifies first finger
  finger1: {
    minAngle: 0,
    maxAngle: 174,
    pin: 10,
    startAt: 0
  }
  //finger2:{}
  //finger3:{}
  //finger4:{}
  //thumb:{}
}, function () {
  // Do initial stuff with the robot once it's ready

  // robot1.finger1.open();
  // robot1.finger1.close();
});

// INIT WEBSERVER
var ws1 = new webserver({
  port: 4444,
  documentRoot: './www',
  api: {
    rule: "/api",
    routeHandler: routeHandler
  }
});

// ROUTES & BUSINESS LOGIC
// Handles requests from client
function routeHandler(request, response) {
  var path = request.url;

  if (!robot1.isReady) {
    return false;
  }


  function jsonResponse(messageObject) {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(messageObject));
    response.end();
  }

  switch (path) {

    /*case '/api/blink-test': // TODO: After I've created a 'led' class in robot.js
      robot1.led.blink(function (messageObject) {
        jsonResponse(messageObject);
      });
      break;*/

    case '/api/open':
      robot1.finger1.open(function (messageObject) {
        jsonResponse(messageObject);
      });
      break;

    case '/api/close':
      robot1.finger1.close(function (messageObject) {
        jsonResponse(messageObject);
      });
      break;

    case '/api/get-pos':
      robot1.finger1.getPos(function (messageObject) {
        jsonResponse(messageObject);
      });
      break;
  }

  if (path.indexOf("/api/goto?angle=") > -1) { // If "?angle=" exists in the string 'path' then...
    var angle = path.substr(16); //takes the characters from the string starting from the 16th characters until the end of the string
    robot1.finger1.goto(angle, function (messageObject) {
      jsonResponse(messageObject);
    });
  }
}
