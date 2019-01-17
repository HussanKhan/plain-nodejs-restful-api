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
        
    // Get the documents user_collection
    const db = client.db("user_Accounts");

    const user_collection = db.collection('pagesum_user');

    // LANDING PAGE
    app.get('/', (request, response) => {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html');
        
        file_system.readFile('templates/tool.html', (err, html) => {
            if (err) {
                throw err;
            }

            let rendered_html = html.toString().replace("${token}", app.token(16));

            const poss_cookie = request.headers.cookie;
            
            if (poss_cookie) {
                const user_id = poss_cookie.replace('pagesumtoken=', '');
                const user_ip = request.connection.remoteAddress;
                
                user_collection.findOne({token: user_id, last_ip: user_ip}, (err, res) => {
                 
                    if (res) {
                        rendered_html = rendered_html.replace("${user_email}", res.email.replace("%40", "@"));
                        rendered_html = rendered_html.replace("${flash_message}", `You are logged in as ${res.email.replace("%40", "@")}`);
                    } 
                    
                    response.write(rendered_html);
                    response.end(); 
                });

                console.log(user_id);
                console.log(user_ip);
            } else {
                rendered_html = rendered_html.replace("${user_email}", '<a style="color: black; text-decoration: none;" href="/signup">Sign Up</a>');
                rendered_html = rendered_html.replace("${flash_message}", "Sign up for a FREE account to get unlimited summaries");
                console.log("Not in db");
                response.write(rendered_html);
                response.end(); 
            }
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

        user_collection.find({email: postdata.email}).toArray((err,stuff) => {
            if (stuff.length == 0) {
        
                bcrypt.hash(postdata.password, saltRounds, (err, hash) => {
                    
                    user_collection.insertOne(
                        {   
                            email:postdata.email, 
                            password: hash
                        }, (err, res) => {
                        
                        if (!(err)) {
                            console.log("SUCCESSFUL INSERT");
                            response.statusCode = 303;
                            response.setHeader('Location', '/login');
                        } else {
                            response.statusCode = 200;
                            response.setHeader('Content-Type', 'text/plain');
                            console.log("FAILED INSERT");
                            response.write("FAILED INSERT");
                        }
                        
                        response.end();
                    });
                });  

            } else {
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/plain');
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
        
        user_collection.find({email: postdata.email}).toArray((err,stuff) => {
            if (stuff.length == 0) {
                response.write("ACCOUNT DOES NOT EXIST");
                response.end();
            } else {
                bcrypt.compare(postdata.password, stuff[0].password, function(err, res) {
                    if (res) {
                        response.statusCode = 303;
                        
                        const utoken = app.token(32);
                        const user_ip = request.connection.remoteAddress;

                        response.setHeader('Set-Cookie', `pagesumtoken=${utoken}; Max-Age=259200`);
                        response.setHeader('Location', '/');
                        user_collection.updateOne({email: postdata.email}, {$set:{token: utoken, last_ip: user_ip}}, (err, res) => {response.end();});
                    } else {
                        file_system.readFile('templates/login.html', (err, html) => {
                            if (err) {
                                throw err;
                            }
                    
                            response.statusCode = 200;
                            response.setHeader('Content-Type', 'text/html');
                    
                            let rendered_html = html.toString().replace("${token}", app.token(16));
                            
                            rendered_html = rendered_html.replace("${flash_message}", "Invalid login");
                    
                            response.write(rendered_html);
                    
                            response.end();
                        })
                    }  
                })
                
            }
        });
    });
     
    // API CONNECTION
    const simplereq = require('./simplerequest');
    app.get('/scan', (request, response) => {
        const url_query = app.extract_query(request.url);
        if (url_query.token === "free_user") {
            
        } else {
            simplereq.make_request(url_query.url, (data) => {
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/plain');
                response.write(data);
                response.end();
            })
        }
    })

    const res = user_collection.find({}).toArray((err,stuff) => {
        console.log(stuff);
    });
    
    app.listen();
});