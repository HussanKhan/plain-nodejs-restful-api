const saturday = require('./saturday');
// File system, loads html and stuff like json
const file_system = require('fs');
// for csfr and tokens
const crypto = require('crypto');

const app = new saturday();

app.spawn_server();



const hello = (request, response) => {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    response.write('HELLO WORLD, THIS IS FROM HELLO() IN APP.JS');
    response.end();
}
app.get('/', hello);

const signup = (request, response) => {

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
    
}
const register_user = (request, response, postdata) => {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    response.write(postdata);
    response.end();
}

app.get('/signup', signup);
app.post('/signup', register_user);

