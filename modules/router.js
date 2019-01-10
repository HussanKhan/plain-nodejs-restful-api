// File system, loads html and stuff like json
const file_system = require('fs');

// for csfr and tokens
const crypto = require('crypto');

const homepage = (response) => {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    response.write('Homepage route');
    response.end();
};

const query = (url, response) => {
    // const req_page = url.replace('url=', '');
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    response.setHeader('Set-Cookie', 'mycookie={"cheese":342432, "pizza": 66766}; Max-Age=120');
    // response.setCookie('sfdsf', '324234');
    response.write(url);
    response.end();
};

const error_404 = (response) => {
    response.statusCode = 404;
    response.setHeader('Content-Type', 'text/plain');
    response.write('Resource not found');
    response.end();
};

const signup = (response) => {

    file_system.readFile('templates/login.html', (err, html) => {
        if (err) {
            throw err;
        }

        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html');

        const token = crypto.randomBytes(16).toString('hex');
        
        const rendered_html = html.toString().replace("${token}", token);

        response.write(rendered_html);
        response.end();
    })
    
};

const register_user = (response, request) => {
    let body = [];

    request.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
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
}


module.exports = {
    router: (request, response) => {

        const route = request.url.split('?')[0];
        // const query_param = request.url.split('url=')[1]

        // Handling Get requests
        if (request.method == "GET") {
            switch (route) {
                case '/': {
                    homepage(response);
                    break;
                }
                case '/query': {
                    query(query_param, response);
                    break;
                }
                case '/signup': {
                    signup(response);
                    break;
                }
                default : {
                    error_404(response);
                    break;
                }
            }
        }
        else if (request.method == "POST") {
            register_user(response, request);
        }
    }
}