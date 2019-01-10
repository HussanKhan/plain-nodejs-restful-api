// You need to create own server with Node, no apache

// Require loads modules
const http = require('http');

// File system, loads html and stuff like json
const file_system = require('fs')

// Server address
const hostname = '127.0.0.1';
const port = 8000;


// Reads fie and makes sure it's there before starting server
file_system.readFile('index.html', (err, html) => {
    if (err) {
        throw err;
    }

    // Creates server https://nodejs.org/en/docs/guides/getting-started-guide/
    // if server is pinged, it will do this
    const server = http.createServer((req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        
        // Writes html into response
        res.write(html);
        
        // res.end('YOUR NODE JS WORKED DUDE!\n');
        res.end();
    });
    // Starts listening on that port and host
    server.listen(port, hostname, () => {
        console.log(`Server is online and listening on http://${ hostname }:${ port }`);
    });   

})