// DECLARATIONS
var five = require("johnny-five");
var board = new five.Board();
const server = require('node-http-server');
var port_number = 4444;
var fingerPos = [0, 0, 0, 0];
var servoOne;

var Finger = function (pinNum, speed, pos, servo) {
	this.pinNum = pinNum;
	this.speed = speed;
	this.pos = pos;
	this.newServo = function () {
		this.servo = new five.Servo({
			pin: this.pinNum
		});
		return this.servo;
	}
	this.getPin = function () {
		return this.pinNum;
	}
	this.getSpd = function () {
		return this.speed;
	}
	this.getPos = function () {
		return this.pos;
	}
	this.movePos = function () {
		this.pos = this.pos + 20;
		return this.pos;
	}
}

var digitOne = new Finger(10, 100, 10, servoOne);



// BOOT CODE
board.on("ready", function () {

	server.onRawRequest = processHttpRequest; // specify function to pass http requests too
	server.deploy(
		{
			port: port_number,
			root: '../www/'
		},
		function () {
			console.log('Server on port ' + server.config.port + ' is now up');
		}
	);


	/*
	var fingers = new five.Servos([{
		pin: 9,
		type: "continuous"
	},{
		pin: 10,
		type:"continuous"
	}]);
	*/



});



// PROCESS HTTP REQUESTS
function processHttpRequest(request, response, serve) {
	var servoOne;
	var digitOne;
	switch (request.uri.path) {

		case '/io?servOne':
			//var servoOne;
			digitOne = new Finger(10, 100, 10, servoOne);
			servoOne = digitOne.newServo();
			console.log("test");

			servoOne.to(digitOne.movePos());
			//servoOne = digitOne.newServo();
			console.log('servONE');
			break;


		case '/io?turnPos':
			console.log('moving');
			servoOne = digitOne.newServo();
			servoOne.to(digitOne.movePos());
			break;

		case '/io?turnNeg':
			console.log("Moving negatively....");
			turnNeg();
			console.log("Moved");
			break;

		case '/io?ninetyDeg':
			console.log("Going to 90 degrees");
			ninetyDeg();
			console.log("At 90 degrees");
			break;

		case '/io?zeroDeg':
			console.log("Going to 0 degrees");
			zeroDeg();
			console.log("At 0 degrees");
			break;

		case '/io?piDeg':
			console.log("Going to 180 degrees");
			piDeg();
			console.log("At 180 degrees");
			break;

		case '/io?sweepIt':
			console.log('Sweeping....');
			sweepTest();
			break;

		case '/io?point':
			console.log('Pointing....');
			pointHand();
			break;

		case '/io?close':
			console.log('Closing....');
			closeHand();
			break;

		case '/io?open':
			console.log('Opening....');
			openHand();
			break;

		case '/io?blink-test':
			console.log('Testing....');
			blinkTest();
			break;
	}

}






















































// ROBOTIC ACTIONS

function blinkTest() {
	// blink onboard led
	var led = new five.Led(13);
	led.blink(500);
	console.log('Blinking!');
}
function sweepTest() {
	var servo = new five.Servo({
		pin: 10
	});
	servo.sweep();
	console.log('Sweeping');
}
function zeroDeg() {
	var servo = new five.Servo({
		pin: 10
	});
	fingerPos[0] = 0;
	servo.to(fingerPos[0]);

}
function piDeg() {
	var servo = new five.Servo({
		pin: 10
	});
	fingerPos[0] = 180;
	servo.to(fingerPos[0]);
}
function ninetyDeg() {
	var servo = new five.Servo({
		pin: 10
	});
	fingerPos[0] = 90;
	servo.to(fingerPos[0]);
}
/*
function turnPos(){
	var servo = new five.Servo({
		pin:10,
		type: "continuous"
	});
	fingerPos[0] = fingerPos[0] + 20;
	servo.to(fingerPos[0]);

}
*/
Finger.prototype.turnPos = function () {
	this.pos = this.pos + 20;
}
function turnNeg() {
	var servo = new five.Servo({
		pin: 10,
		fps: 150,
		type: "continuous"
	});
	fingerPos[0] = fingerPos[0] - 20;
	servo.to(fingerPos[0]);
}
function stopServo() {
	var servo = new five.Servo({
		pin: 10
	})
	servo.stop();
	console.log("stopped");
}

//Hold all data on finger in a text file