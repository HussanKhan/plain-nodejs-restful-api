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


app.get('/signup', (request, response) => {

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
    
});

app.post('/signup', (request, response, postdata) => {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    response.write(`Email: ${postdata.email}\nPassword: ${postdata.password}\nToken: ${postdata.token}`);
    response.end();
});

