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

        const poss_cookie = request.headers.cookie;
        
        if (poss_cookie) {
            const user_id = poss_cookie.replace('pagesumtoken=', '');
            const user_ip = request.connection.remoteAddress;
            
            user_collection.findOne({token: user_id, last_ip: user_ip}, (err, res) => {
             
                if (res) {
                    
                    const html_vars = {
                        token: app.token(16), 
                        flash_message: `You are logged in as ${res.email.replace("%40", "@")}`, 
                        user_email: res.email.replace("%40", "@")
                    };
                    
                    console.log("FOUND IN DB");
                    app.render_html(response, html_vars, "tool.html");
                
                    } else {

                        const html_vars = {
                            token: app.token(16), 
                            flash_message: "Sign up for a FREE account to get unlimited summaries", 
                            user_email: '<a style="color: black; text-decoration: none;" href="/signup">Sign Up</a>'
                        };
                    
                        app.render_html(response, html_vars, "tool.html");
                    }
            });

            console.log(user_id);
            console.log(user_ip);

        } 
    });
    
    // SIGN UP
    app.get('/signup', (request, response) => {
        
        const html_vars = {
            token: app.token(16), 
        };
    
        app.render_html(response, html_vars, "signup.html");
        
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
                            response.end();
                        
                        } else {
                            
                            const html_vars = {
                                token: app.token(16),
                                flash_message: "Failed to create account" 
                            };
                        
                            app.render_html(response, html_vars, "signup.html");
                        }
                    });
                });  

            } else {
                const html_vars = {
                    token: app.token(16),
                    flash_message: "Account with that email already exists" 
                };
                app.render_html(response, html_vars, "signup.html");
            }
        });
    });

    // LOGIN
    app.get('/login', (request, response) => {

        const html_vars = {
            token: app.token(16),
        };
        
        app.render_html(response, html_vars, "login.html");
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
                        
                        user_collection.updateOne({email: postdata.email}, {$set:{token: utoken, last_ip: user_ip}}, (err, res) => {
                            response.end();
                        });
                    
                    } else {
                        const html_vars = {
                            token: app.token(16),
                            flash_message: "Invalid login"
                        };
                        
                        app.render_html(response, html_vars, "login.html");

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