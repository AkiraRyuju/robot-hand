//The main program - brings everything together

//Imports classes
var webserver = require('./webserver');
var robot = require('./robot');

// INIT ROBOT - Make instance of robot
var robot1 = new robot({
  // comPort: "COM3", // TODO: If we ever wanted to instantiate multiple Arduinos on different COM ports
  //Specifies first finger
  //First finger is the first object in the list of objects in options
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
  port: 4444, //specify port
  documentRoot: './www', // Specify file location when starting from the root
  api: {
    rule: "/api", // The api rule for commands
    routeHandler: routeHandler //Specify function used for route handler
  }
});

// ROUTES 
// Handles requests from client
function routeHandler(request, response) {
  var path = request.url; //The ajax requested url

  if (!robot1.isReady) { //if the board is not ready yet
    return false; //stops the command from being executed before board is ready
  }


  function jsonResponse(messageObject) { //This function creates the response which is sent back to the client
    response.writeHead(200, { 'Content-Type': 'application/json' }); //200 is code for success
    response.write(JSON.stringify(messageObject)); //Turns messageObject into JSON
    response.end();
  }

  switch (path) {

    //Handles requests


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

  if (path.indexOf("/api/goto?angle=") > -1) { // If "?angle=" exists in the string 'path' then... If it is at the beginning of the string, then it returns 0 hence why -1 instead of 0
    var angle = path.substr(16); //takes the characters from the string starting from the 16th characters until the end of the string
    robot1.finger1.goto(angle, function (messageObject) {
      jsonResponse(messageObject);
    });
  }
  if(path.indexOf("/api/calibrate/") > -1) {
    console.log('Been called');
    var minOffset = path.substr(19, 3);
    var maxOffset = path.substr(27, 3);
    robot1.finger1.calibrate(minOffset, maxOffset, function (messageObject){
      jsonResponse(messageObject);
    });
  }
}
