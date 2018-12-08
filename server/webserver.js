class webserver {
  constructor(options) {
    const server = require('node-http-server');
    server.onRequest = options.routes; // specify function to pass http requests too

    server.deploy(
      {
        port: options.port ? options.port : 8080,
        root: options.documentRoot
      },
      function () {
        console.log(`Server on port ${options.port} is now up`);
      }
    );
  }
}

module.exports = webserver;