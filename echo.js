// You need to create own server with Node, no apache

// Require loads modules
const http = require('http');

// Server address
const hostname = '127.0.0.1';
const port = 8000;

// This handles a one http request
// Is called whenever server recieves request

const server = http.createServer((request, response) => {
    // destructuring operator
    // stores object headers, method in varaibles headers and method
    // Basically opens request
    const { headers, method, url } = request;

    // This reads request
    let body = [];

    // The on is an event listenr, if error is present or if data is present it activates
    // Data comes in packets, so keep appending until end of chuck in detected
    // At the end of this, body has data from post request
    request.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        console.log(chunk);
        body.push(chunk);
    }).on('end', () => {
        // IT'S ASYNC, SO RESPONSE MUST BE MADE HERE FOR ECHO
        body = Buffer.concat(body).toString();
        // response.end(body);
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        response.write(body);
        response.end();
    });

    // console.log(body);

    // This is what is returned
    // response.end() returns response
    // building response
    // response.statusCode = 200;
    // response.setHeader('Content-Type', 'text/plain');
    // response.write('got something');
    // response.end();

});

// Starts listening on that port and host
server.listen(port, hostname, () => {
    console.log(`Server is online and listening on http://${ hostname }:${ port }`);
});   