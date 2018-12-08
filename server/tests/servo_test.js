var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function(){
	var tit = new five.Servo({
		pin: 10
	})
	tit.to(90);
	//tit.to(180);
});
