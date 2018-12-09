class webserver {
  constructor(options) {
    const http = require('http');
    const fs = require('fs');
    const path = require('path');

    http.createServer(function (request, response) {

      var filePath = request.url;
      if (filePath == '/')
        filePath = '/index.html';

      var extension = path.extname(filePath);

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
            if (error.code == 'ENOENT') {
              fs.readFile('./404.html', function (error, content) {
                response.writeHead(200, { 'Content-Type': contentType });
                response.end(content, 'utf-8');
              });
            } else {
              response.writeHead(500);
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