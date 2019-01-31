const five = require("johnny-five");

//Class so that the whole thing can be used as an object
class robot {
  constructor(options, callback) {
    //const board = new five.Board(); // TODO: Specify COM port from options
    const board = new five.Board();

    this.isReady = false;

    // Constructs the first finger
    this.finger1 = new digit({
      minAngle: options.finger1.minAngle,
      maxAngle: options.finger1.maxAngle,
      pin: options.finger1.pin,
      startAt: options.finger1.startAt
    });
    //Arrow function does magic to 'this' 
    //// Lexical this - The this will not refer to board but will instead refer to constructor/ robot
    board.on("ready", () => {
      this.isReady = true; //flag for if board is ready
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
    this.currentPosition = options.startAt;

  }

  //Connects servo to an instance of the finger
  //Will only run once the board is ready - The methods need the board to be ready first to run
  bind() {
    this.servo = new five.Servo({
      pin: this.pin,
      deviceRange: [0, 174],
      startAt: this.currentPosition
    });
  }

  //Method to do the sweep function
  getPos(callback) {
    //Will try to execute the code within the try but will do the Catch err part if any error is thrown
    console.log(this.currentPosition);

    callback({
      "message": "success",
      "angle": this.currentPosition
    });
  }

  close(callback) {
    // TODO: add speed argument
    try {
      callback(this.log(`Closing to angle ${this.minAngle}`)); //New way to combine String and Variables in a log
      this.servo.to(this.minAngle);
      this.currentPosition = this.minAngle;
    } catch (err) {
      callback(this.error(err));
    }
  }

  open(callback) {
    // TODO: add speed argument
    try {
      callback(this.log(`Opening to angle ${this.maxAngle}`));
      this.servo.to(this.maxAngle);
      this.currentPosition = this.maxAngle;
    } catch (err) {
      callback(this.error(err));
    }
  }

  goto(angle, callback) {
    angle = parseInt(angle);

    if (isNaN(angle)) {

      callback(this.error({ message: `'angle' is not a number!` }));

    } else {

      if (angle < this.minAngle || angle > this.maxAngle) { //Makes sure that the requested Angle is within bounds

        callback(this.error({ message: `Angle ${angle} out of range ${this.minAngle}-${this.maxAngle}` }));

      } else {

        try {
          callback(this.log(`Going to angle ${angle}`));
          this.servo.to(angle);
          this.currentPosition = angle;
        } catch (err) {
          callback(this.error(err));
        }

      }

    }

  }

  calibrate(minOffset, maxOffset, callback) {
    // TODO: Add these to a data store
    minOffset = parseInt(minOffset);
    maxOffset = parseInt(maxOffset);
    console.log("test");
    if(isNaN(minOffset) || isNaN(maxOffset)){
      callback(this.error({message: `One or more of the offsets are invalid`}))
    }
    try{
      this.maxAngle = this.maxAngle + maxOffset;
      this.minAngle = this.minAngle + minOffset;
      callback(this.log(`Min and Max angles have been updated`))
    }catch(err){
      callback(this.error(err));
    }
  }

  log(message) {
    console.log(message);
    return { message: message };
    // TODO: return console message to webserver
  }

  error(err) {
    return this.log(`Digit error. (${err.message})`); //Only throws back a readable, necessary part of the error message
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