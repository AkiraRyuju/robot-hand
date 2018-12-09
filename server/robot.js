const five = require("johnny-five");

//Class so that the whole thing can be used as an object
class robot {
  constructor(options, callback) {
    //const board = new five.Board(); // TODO: Specify COM port from options
    const board = new five.Board();

    // COnstructs the first finger
    this.finger1 = new digit({
      minAngle: options.finger1.minAngle,
      maxAngle: options.finger1.maxAngle,
      pin: options.finger1.pin
    });
    //Arrow function does magic to 'this' 
    //// Lexical this - The this will not refer to board but will instead refer to constructor/ robot
    board.on("ready", () => {
      this.finger1.bind();
      callback();
    });
  }
}


class digit {
  constructor(options) {
    /*
      var options = {
        minAngle:  
        maxAngle:
        pin:
      }
    */
    this.minAngle = options.minAngle;
    this.maxAngle = options.maxAngle;
    this.pin = options.pin;

  }
  //Connects servo to an instance of the finger
  //Will only run once the board is ready - The methods need the board to be ready first to run
  bind() {
    this.servo = new five.Servo({
      pin: this.pin,
      deviceRange: [0, 180]
    });
  }
  //Method to do the sweep function
  sweep() {
    //Will try to execute the code within the try but will do the Catch err part if any error is thrown
    try {
      this.servo.sweep();
      this.log(`Sweeping...`);
    } catch (err) {
      this.error(err);
    }
  }
  close() {
    // TODO: add speed argument
    try {
      this.servo.to(this.minAngle);
      this.log(`Going to angle ${this.minAngle}`); //New way to combine String and Variables in a log
    } catch (err) {
      this.error(err);
    }
  }
  open() {
    // TODO: add speed argument
    try {
      this.log(`Going to angle ${this.maxAngle}`);
      this.servo.to(this.maxAngle);
    } catch (err) {
      this.error(err);
    }
  }
  goto(angle, err) {
    if (angle < this.minAngle || angle > this.maxAngle) { //Makes sure that the requested Angle is within bounds
      err('Angle out of bounds!');
    } else {
      try {
        this.log(`Going to angle ${angle}`);
        this.servo.to(angle);
      } catch (err) {
        this.error(err);
      }
    }
  }
  log(message) {
    console.log(message);
    // TODO: return console message to webserver
  }
  error(err) {
    this.log(`Digit error. (${err.message})`); //Only throws back a readable, necessary part of the error message
  }
  getInfo() {
    // TODO: return this class' information
  }
  calibrate(minOffset, maxOffset) {
    // TODO: Add these to a data store
  }
}

//Allows the class robot to be able to be used 
module.exports = robot;