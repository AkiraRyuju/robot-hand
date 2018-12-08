var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function(){
  var pener;
  var digitOne = new Finger(10,100, 10, pener);
  pener = digitOne.newServo();
  console.log(digitOne.getPin());
  console.log(digitOne.getSpd());
  pener.to(digitOne.getPos());
  console.log(digitOne.getPos());
  pener.to(digitOne.move());
  console.log(digitOne.getPos());
  

});
function Finger(pinNum, speed, pos, servo) {
  this.pinNum = pinNum;
  this.speed = speed;
  this.pos = pos;
  this.newServo = function(){
    this.servo = new five.Servo({
    pin: this.pinNum
    });
    return this.servo;
  }
  this.getPin = function(){
    return this.pinNum;
  }
  this.getSpd = function(){
    return this.speed;
  }
  this.getPos = function(){
    return this.pos;
  }
  this.move = function(){
    this.pos = this.pos + 20;
    return this.pos;
  }
}
