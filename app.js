// You need to create own server with Node, no apache

// Require loads modules
const http = require('http');
const route = require('./modules/router');

const server = http.createServer(route.router);

const hostname = '127.0.0.1';
const port = 8000;

server.listen(port, hostname, () => {
    console.log(`Server is online and listening on http://${ hostname }:${ port }`);
});   