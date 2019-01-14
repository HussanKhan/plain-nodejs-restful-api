const saturday = require('./saturday');
// File system, loads html and stuff like json
const file_system = require('fs');

const app = new saturday();

const mongodb = require('mongodb');

const datab = mongodb.MongoClient;
 
// Define where the MongoDB server is
const url = 'mongodb://localhost:27017/';
 
// Connect to the server
datab.connect(url, (err, client) => {
    if (err) {
        console.log('Unable to connect to the Server', err);
    } 

    // We are connected
    console.log('Connection established to', url);
        
    // Get the documents collection
    const db = client.db("user_Accounts");

    const collection = db.collection('pagesum_user');
    
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
    
        file_system.readFile('templates/signup.html', (err, html) => {
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
    
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    app.post('/signup', (request, response, postdata) => {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        
        collection.find({email: postdata.email}).toArray((err,stuff) => {
            if (stuff.length == 0) {
        
                bcrypt.hash(postdata.password, saltRounds, (err, hash) => {
                    collection.insertOne({email:postdata.email, password: hash}, (err, res) => {
                        if (!(err)) {
                            console.log("SUCCESSFUL INSERT");
                            response.write("SUCCESSFUL INSERT");
                        } else {
                            console.log("FAILED INSERT");
                            response.write("FAILED INSERT");
                        }
                        response.end();
                    });
                });  

            } else {
                response.write("EMAIL ALREADY IN DATABASE");
                response.end();
            }
        });
    });

    // LOGIN
    app.get('/login', (request, response) => {
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

    app.post('/login', (request, response, postdata) => {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        
        collection.find({email: postdata.email}).toArray((err,stuff) => {
            if (stuff.length == 0) {
                response.write("ACCOUNT DOES NOT EXIST");
                response.end();
            } else {
                bcrypt.compare(postdata.password, stuff[0].password, function(err, res) {
                    if (res) {
                        response.write("SUCCESSFUL LOGIN");
                    } else {
                        response.write("PASSWORD DID NOT MATCH");
                    }
                    response.end();
                })
                
            }
        });
    });
    
    
    const simplereq = require('./simplerequest');
    app.get('/scan', (request, response) => {
        const url_query = app.extract_query(request.url);
        simplereq.make_request(url_query.url, (data) => {
            response.statusCode = 200;
            response.setHeader('Content-Type', 'text/plain');
            response.write(data);
            response.end();
        })
    })

    const res = collection.find({}).toArray((err,stuff) => {
        console.log(stuff);
    });
    
    app.listen();
});