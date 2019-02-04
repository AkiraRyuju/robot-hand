//The main program - brings everything together

//Imports classes
var webserver = require('./webserver');
var robot = require('./robot');

// INIT ROBOT - Make instance of robot
var robot1 = new robot({
  //Specifies first finger
  //First finger is the first object in the list of objects in options
  finger1: {
    minAngle: 0,
    maxAngle: 174,
    pin: 10,
    startAt: 0,
    minOff: 0,
    maxOff: 0
  },
  finger2: {
    minAngle: 0,
    maxAngle: 174,
    pin: 11,
    startAt: 0,
    minOff: 0,
    maxOff: 0
  }
  //finger3:{}
  //finger4:{}
  //thumb:{}
}, function () {
  // Do initial stuff with the robot once it's ready

  //robot1.finger1.open();
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
    response.end(JSON.stringify(messageObject)); //Turns messageObject into JSON
  }



  //Handles requests
  if (path.indexOf("/api/get-min-max") > -1) { // If "?angle=" exists in the string 'path' then... If it is at the beginning of the string, then it returns 0 hence why -1 instead of 0
  console.log(path);
  var fingerNumber = path.substr(17);
  console.log(fingerNumber);
  switch (fingerNumber){
    case '1':
      robot1.finger1.getMinMax(fingerNumber, function (messageObject) { //needs to be able to hold what finger it is
        jsonResponse(messageObject);
      });
      break;
    case '2':
      robot1.finger2.getMinMax(fingerNumber, function (messageObject) { //needs to be able to hold what finger it is
        jsonResponse(messageObject);
      });
    break;
  }
}
  
  if (path.indexOf("/api/get-pos") > -1) { // If "?angle=" exists in the string 'path' then... If it is at the beginning of the string, then it returns 0 hence why -1 instead of 0
    console.log(path);
    var fingerNumber = path.substr(13);
    console.log(fingerNumber);
    switch (fingerNumber){
      case '1':
        robot1.finger1.getPos(fingerNumber, function (messageObject) { //needs to be able to hold what finger it is
          jsonResponse(messageObject);
        });
        break;
      case '2':
        robot1.finger2.getPos(fingerNumber, function (messageObject) { //needs to be able to hold what finger it is
          jsonResponse(messageObject);
        });
      break;
    }
  }
  if (path.indexOf("/api/close") > -1) { // If "?angle=" exists in the string 'path' then... If it is at the beginning of the string, then it returns 0 hence why -1 instead of 0
    console.log(path);
    var fingerNumber = path.substr(11);
    console.log(fingerNumber);
    switch (fingerNumber){
      case '1':
        robot1.finger1.close(fingerNumber, function (messageObject) { //needs to be able to hold what finger it is
          jsonResponse(messageObject);
        });
        break;
      case '2':
        robot1.finger2.close(fingerNumber, function (messageObject) { //needs to be able to hold what finger it is
          jsonResponse(messageObject);
        });
      break;
    }
  }
  if (path.indexOf("/api/open") > -1) { // If "?angle=" exists in the string 'path' then... If it is at the beginning of the string, then it returns 0 hence why -1 instead of 0
    console.log(path);
    var fingerNumber = path.substr(10);
    console.log(fingerNumber);
    switch (fingerNumber){
      case '1':
        robot1.finger1.open(fingerNumber, function (messageObject) { //needs to be able to hold what finger it is
          jsonResponse(messageObject);
        });
        break;
      case '2':
        robot1.finger2.open(fingerNumber, function (messageObject) { //needs to be able to hold what finger it is
          jsonResponse(messageObject);
        });
      break;
    }
  }

  if (path.indexOf("/api/goto?angle=") > -1) { // If "?angle=" exists in the string 'path' then... If it is at the beginning of the string, then it returns 0 hence why -1 instead of 0
    console.log(path);
    var angle = path.substr(16,4); //takes the characters from the string starting from the 16th characters until the end of the string
    var fingerNumber = path.substr(21);
    console.log(fingerNumber);
    switch (fingerNumber){
      case '1':
        robot1.finger1.goto(angle, fingerNumber, function (messageObject) {
          jsonResponse(messageObject);
        });
        break;
      case '2':
        robot1.finger2.goto(angle, fingerNumber, function (messageObject) {
          jsonResponse(messageObject);
        });
      break;

    }
  }

  if(path.indexOf("/api/calibrate/") > -1) {
    console.log(path);
    var minOffset = path.substr(18, 3);
    var maxOffset = path.substr(25, 3);
    var fingerNumber = path.substr(29);
    console.log(fingerNumber);
    console.log(maxOffset);
    switch (fingerNumber){
      case '1':
        robot1.finger1.calibrate(minOffset, maxOffset, fingerNumber, function (messageObject){
          jsonResponse(messageObject);
        });
        break;
      case '2':
        robot1.finger2.calibrate(minOffset, maxOffset, fingerNumber, function (messageObject){
          jsonResponse(messageObject);
        });
      break;

    }
    
  }
}
