module.exports = class Saturday {

    // This class is used to work with nodejs

    constructor() {
        this.http = require('http');
        this.endpoints = {
            "get":[],
            "post":[],
            "put": [],
            "delete":[]
        };
    }

    // handles get, post, put, and delete requests
    request_handle(request, response) {

        // 405 method not allowed
        const route = request.url.split('?')[0];

        const method = request.method.toLowerCase();
        
        console.log(`Route: ${route} Method: ${method}`);

        for (let i = 0; i < this.endpoints[method].length; i++) {
            
            if (this.endpoints[method][i].route === route) {

                if (method === "post") {
                    
                    // Post data comes in stream
                    let body = [];
                    
                    request.on('error', (err) => {
                        console.error(err);
                    }).on('data', (chunk) => {
                        body.push(chunk);
                    }).on('end', () => {
                        this.endpoints[method][i].command(request, response, body);
                    });

                } else {
                    
                    this.endpoints[method][i].command(request, response);
                
                }

                break;
            }
        }
    };

    // Creates server and begins listening
    spawn_server() {
        console.log(this.endpoints);
        const server = this.http.createServer(this.request_handle.bind(this));
        const hostname = '127.0.0.1';
        const port = 8000;

        server.listen(port, hostname, () => {
            console.log(`Server is online and listening on http://${ hostname }:${ port }`);
        });
    }

    // Adds route into endpoints array, later to be used by request_handle
    get(end, task) {
        this.endpoints["get"].push({"route": end, "command":task});
    }
    post(end, task) {
        this.endpoints["post"].push({"route": end, "command":task});
    }
    put(end, task) {
        this.endpoints["put"].push({"route": end, "command":task});
    }
    delete(end, task) {
        this.endpoints["delete"].push({"route": end, "command":task});
    }

    // Extracts queries from url, and return in object array
    extract_query(url) {
        const query_array = url.split("?").slice(1);
        const query_obj = {};

        query_array.forEach(q_str => {
            const q_piece = q_str.split("=");
            query_obj[q_piece[0]] = q_piece[1];
        });

        return query_obj;
    }

}