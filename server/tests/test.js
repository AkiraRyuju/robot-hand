const server = require('node-http-server');
var port_number = 1488;

function ass(roundness, pert){
	this.roundness = roundness;
	this.pert = pert;
	this.getR = function(){
		return this.roundness;
	}
	this.getP = function(){
		return this.pert;
	}
	this.inR = function(){
		this.roundness = this.roundness + 5;
	}
}

function bootServer(){
	server.onRawRequest = processHttpRequest; // specify function to pass http requests too
	server.deploy(
		{
			port: port_number,
			root: '../teeeeeeeeeet/'
		},
		function(){
			console.log('Server on port ' + server.config.port + ' is now up');
		}
	);
}

function processHttpRequest(request, response, serve){

	switch(request.uri.path){

		case '/io?makeAss':
		var assOne = new ass(3,8);
		console.log('ass' + assOne.getR());
		break;

		case '/io?round':
		console.log('aesdfghfdsafgnhfdsafghfdsafgdsa');
		console.log('Roundness: ' + assOne.getR());
		break;
	}
}
bootServer();