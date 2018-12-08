const five = require("johnny-five");

class robot {
  constructor(options, callback) {
    //const board = new five.Board(); // TODO: Specify COM port from options
    const board = new five.Board();

    this.finger1 = new digit({
      minAngle: options.finger1.minAngle,
      maxAngle: options.finger1.maxAngle,
      pin: options.finger1.pin
    });

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
  bind() {
    this.servo = new five.Servo({
      pin: this.pin,
      deviceRange: [0, 180]
    });
  }
  sweep() {
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
      this.log(`Going to angle ${this.minAngle}`);
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
    if (angle < this.minAngle || angle > this.maxAngle) {
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
    this.log(`Digit error. (${err.message})`);
  }
  getInfo() {
    // TODO: return this class' information
  }
  calibrate(minOffset, maxOffset) {
    // TODO: Add these to a data store
  }
}

module.exports = robot;