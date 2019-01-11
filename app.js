const saturday = require('./saturday');

const app = new saturday();

app.spawn_server();

const hello = (request, response) => {
    const q = app.extract_query(request.url);
    console.log(q);
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    response.write('HELLO WORLD, THIS IS FROM HELLO() IN APP.JS');
    response.end();
}

app.route('/query', hello);