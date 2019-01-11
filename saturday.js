module.exports = class Saturday {

    // This class is used to work with nodejs

    constructor() {
        this.http = require('http');
        this.endpoints = [];
    }

    request_handle(request, response) {
        // 405 method not allowed
        const route = request.url.split('?')[0];

        console.log(route);

        for (let i = 0; i < this.endpoints.length; i++) {
            if (this.endpoints[i].route == route) {
                this.endpoints[i].command(request, response);
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
    route(end, task) {
        this.endpoints.push({"route": end, "command":task});
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