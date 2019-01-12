const saturday = require('./saturday');
// File system, loads html and stuff like json
const file_system = require('fs');

const app = new saturday();

app.spawn_server();


app.get('/', (request, response) => {
    file_system.readFile('templates/tool.html', (err, html) => {
        if (err) {
            throw err;
        }

        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html');
        
        const rendered_html = html.toString().replace("${token}", app.token(16));

        response.write(rendered_html);

        response.end();
    })
});

// SIGN UP
app.get('/signup', (request, response) => {

    file_system.readFile('templates/login.html', (err, html) => {
        if (err) {
            throw err;
        }

        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html');

        
        
        const rendered_html = html.toString().replace("${token}", app.token(16));

        response.write(rendered_html);

        response.end();
    })
    
});

app.post('/signup', (request, response, postdata) => {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    const token = app.token(32);
    response.setHeader('Set-Cookie', `token=${token}; Max-Age=3600;`);
    response.write(`Email: ${postdata.email}\nPassword: ${postdata.password}\nToken: ${postdata.token}`);
    response.end();
});


const simplereq = require('./simplerequest');
app.get('/test', (request, response) => {
    simplereq.make_request('https://arstechnica.com/gaming/2019/01/unity-engine-tos-change-makes-cloud-based-spatialos-games-illegal/', (data) => {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        response.write(data);
        response.end();
    })
})

