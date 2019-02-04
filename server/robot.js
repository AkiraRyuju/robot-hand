const five = require("johnny-five");
//Class so that the whole thing can be used as an object
class robot {
  constructor(options, callback) {
    const board = new five.Board();

    this.isReady = false;

    // Constructs the first finger
    this.finger1 = new digit({
      minAngle: options.finger1.minAngle,
      maxAngle: options.finger1.maxAngle,
      pin: options.finger1.pin,
      startAt: options.finger1.startAt,
      minOffset: options.finger1.minOff,
      maxOffset: options.finger1.maxOff
    });
    this.finger2 = new digit({
      minAngle: options.finger2.minAngle,
      maxAngle: options.finger2.maxAngle,
      pin: options.finger2.pin,
      startAt: options.finger2.startAt,
      minOffset: options.finger2.minOff,
      maxOffset: options.finger2.maxOff
    });
    //// Lexical this - The this will not refer to board but will instead refer to constructor/ robot
    board.on("ready", () => {
      this.isReady = true; //flag for if board is ready
      this.finger1.bind();
      this.finger2.bind();
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
        startAt:
        minOffset:
        maxOffset:
      }
    */
    this.minAngle = options.minAngle;
    this.maxAngle = options.maxAngle;
    this.pin = options.pin;
    this.currentPosition = options.startAt;
    this.minOffset = options.minOffset;
    this.maxOffset = options.maxOffset;

  }

  //Connects servo to an instance of the finger
  //Will only run once the board is ready - The methods need the board to be ready first to run
  bind() {
    this.servo = new five.Servo({
      pin: this.pin,
      deviceRange: [this.minAngle, this.maxAngle],
      startAt: this.currentPosition
    });
  }

  //Method to do the sweep function
  getPos(fingerNumber, callback) {
    //Will try to execute the code within the try but will do the Catch err part if any error is thrown
    console.log(this.currentPosition);
    try{
      callback({
        "message": `Currently at ${this.currentPosition} degrees`,
        "angle": this.currentPosition,
        "fingerNumber": fingerNumber
      });
    }catch(err) {
      callback(this.error(err, fingerNumber));
    }
  }
  getMinMax(fingerNumber, callback) {
    //Will try to execute the code within the try but will do the Catch err part if any error is thrown
    try{
      callback({
        "message": `Minimum angle is ${this.minAngle} and Maximum angle is ${this.maxAngle}`,
        "minAngle": this.minAngle,
        "maxAngle": this.maxAngle,
        "fingerNumber": fingerNumber
      });
    }catch(err) {
      callback(this.error(err, fingerNumber));
    }
  }

  close(fingerNumber, callback) {
    try {
      callback(this.log(`Closing to angle ${this.minAngle}`, fingerNumber)); //New way to combine String and Variables in a log
      this.servo.to(this.minAngle);
      this.currentPosition = this.minAngle;
    } catch (err) {
      callback(this.error(err, fingerNumber));
    }
  }
  

  open(fingerNumber, callback) {
    try {
      callback(this.log(`Opening to angle ${this.maxAngle}`, fingerNumber)); //TODO test return
      this.servo.to(this.maxAngle); //Moves the servo to the max angle
      this.currentPosition = this.maxAngle; // Keeps track of the current position of the 
    } catch (err) {
      callback(this.error(err, fingerNumber));
    }
  }
  
  goto(angle, fingerNumber, callback) {
    angle = parseInt(angle); //If the angle is not an int, it will return 'NaN' ('Not a Number')
    
    if (isNaN(angle)) {
      
      callback(this.error({ message: `'angle' is not a number!`}, fingerNumber));
      
    } else {
      
      if (angle < this.minAngle || angle > this.maxAngle) { //Makes sure that the requested Angle is within bounds
        
        callback(this.error({ message: `Angle ${angle} out of range ${this.minAngle}-${this.maxAngle}`, fingerNumber }));
        
      } else {
        
        try {
          callback(this.log(`Going to angle ${angle}`, fingerNumber));
          this.servo.to(angle);
          this.currentPosition = angle;
        } catch (err) {
          callback(this.error(err, fingerNumber));
        }
        
      }
      
    }
    
  }
  
  calibrate(minOffset, maxOffset, fingerNumber, callback) {
    // TODO: Add these to a data store
    minOffset = parseInt(minOffset);
    maxOffset = parseInt(maxOffset);
    console.log("test");
    if(isNaN(minOffset) || isNaN(maxOffset)){
      callback(this.error({message: `One or more of the offsets are invalid`}, fingerNumber))
    }else{
      try{
        console.log(minOffset);
        console.log(maxOffset);
        this.maxAngle = this.maxAngle + maxOffset;
        this.minAngle = this.minAngle + minOffset;
        console.log(this.maxAngle);
        callback(this.log(`Min and Max angles have been updated`, fingerNumber)) //callback is the function message is messageObject
      }catch(err){
        callback(this.error(err, fingerNumber));
      }
    }
  }

  log(message, fingerNumber) { //Add variable for which finger here
    console.log(message);
    console.log(fingerNumber);
    return { message: message, fingerNumber: fingerNumber };
    // TODO: return console message to webserver
  }

  error(err, fingerNumber) {
    return this.log(`Digit error. (${err.message})`, fingerNumber); //Only throws back the readable, necessary part of the error message
  }

  getInfo() {
    // TODO: return this class' information
  }

}

//Allows the class robot to be able to be used 
module.exports = robot;