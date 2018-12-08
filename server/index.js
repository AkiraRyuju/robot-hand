var webserver = require('./webserver');
var robot = require('./robot');

// INIT ROBOT
var robot1 = new robot({
  // comPort: "COM3", // TODO: If we ever wanted to instantiate multiple Arduinos on different COM ports
  finger1: {
    minAngle: 0,
    maxAngle: 174,
    pin: 10
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
  routes: routes
});

// ROUTES & BUSINESS LOGIC
function routes(request, response, serve) {
  var path = request.uri.path;

  switch (path) {

    case '/api/open':
      robot1.finger1.open();
      break;

    case '/api/close':
      robot1.finger1.close();
      break;

    case '/api/sweep':
      robot1.finger1.sweep();
      break;
  }

  if (path.indexOf("/api/goto?angle=") > -1) { // If "?angle=" exists in the string 'path' then...
    var angle = path.substr(16);
    robot1.finger1.goto(angle);
  }
}
