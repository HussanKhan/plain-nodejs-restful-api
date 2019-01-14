module.exports = class Saturday {

    // This is a small framework for nodejs
    // meant to handle common operations

    constructor() {
        this.http = require('http');
        this.crypto = require('crypto');
        this.endpoints = {
            "get":[],
            "post":[],
            "put": [],
            "delete":[]
        };
    }

    // Called when server recieves request
    request_handle(request, response) {

        // 405 method not allowed
        const route = request.url.split('?')[0];

        const method = request.method.toLowerCase();
        
        console.log(`Route: ${route} Method: ${method}`);

        this.endpoints[method].forEach(endpoint => {
            
            if (endpoint.route === route) {

                // POST data handled differently 
                if (method === "post") {
                    
                    // Post data comes in stream
                    let body = [];
                    
                    // Data chunk detected
                    request.on('data', (chunk) => {
                        body.push(chunk);
                    });
                    
                    // End of data stream detected, return data
                    request.on('end', () => {
                        body = body.toString();
                        body  = this.extract_post(body);
                        endpoint.command(request, response, body);
                    });

                    // If error raised in request
                    request.on('error', (err) => {
                        console.error(err);
                    });

                } else {
                    // If not post, callback function called
                    endpoint.command(request, response);
                }
                
                return 0;
            }

        });
    };

    // Creates server and begins listening
    listen(port=8000) {
        console.log(this.endpoints);
        const server = this.http.createServer(this.request_handle.bind(this));
        const hostname = '127.0.0.1';

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

    // Extracts post data
    extract_post(postdata) {
        const post_array = postdata.split("&");
        const post_obj = {};

        post_array.forEach(p_str => {
            const p_piece = p_str.split("=");
            post_obj[p_piece[0]] = p_piece[1];
        });

        return post_obj;
    }

    // Creates token of some byte length
    token(bytes) {
        const token = this.crypto.randomBytes(bytes).toString('hex');
        return token;
    }

}