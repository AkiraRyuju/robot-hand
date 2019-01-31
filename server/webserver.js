class webserver {
  //Constuctor uses options object passed from index
  constructor(options) {
    const http = require('http');
    const fs = require('fs');
    const path = require('path');
    //Creates server with request: the request sent from the client,  and response: What the server sends back to the client
    http.createServer(function (request, response) {

      var filePath = request.url; // The requested page url
      if (filePath == '/') //If the client requests the home page ie Without anything after the main url
        filePath = '/index.html'; // Serves the client with the main page

      var extension = path.extname(filePath); //Finds the extension name of the file

      var contentType = 'text/html';
      switch (extension) {
        case '.js':
          contentType = 'text/javascript';
          break;
        case '.css':
          contentType = 'text/css';
          break;
        case '.json':
          contentType = 'application/json';
          break;
        case '.png':
          contentType = 'image/png';
          break;
        case '.jpg':
          contentType = 'image/jpg';
          break;
      }

      if (options.api.rule && filePath.indexOf(options.api.rule) > -1) {
        // matches api rule
        options.api.routeHandler(request, response);
      } else {
        // matches fileserver file

        filePath = options.documentRoot + filePath;

        fs.readFile(filePath, function (error, content) {
          if (error) {
            if (error.code == 'ENOENT') { // ENOENT is for if there is no file found (error 404)
              fs.readFile('./404.html', function (error, content) {
                response.writeHead(200, { 'Content-Type': contentType });
                response.end(content, 'utf-8');
              });
            } else {
              response.writeHead(500); //Internal server error
              response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
              response.end();
            }
          } else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
          }
        });
      }

    }).listen(options.port ? options.port : 8080);

    console.log(`Server started on port ${options.port}`);
  }
}

module.exports = webserver;