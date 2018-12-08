





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