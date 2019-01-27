const saturday = require('./saturday');
// File system, loads html and stuff like json
const file_system = require('fs');
const bcrypt = require('bcrypt');

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

    // Checks if user is valid, if valid, gives token
    const user_check = (user_data, callback) => {
        console.log(user_data);
        user_collection.find({email: user_data.email}).toArray((err, result) => {
            if (result.length != 0) {
                
                // Password check
                bcrypt.compare(user_data.password, result[0].password, (err, res) => {
                    if (res) {

                        // Create token
                        const utoken = app.token(32);

                        // Update db with token and last ip
                        user_collection.updateOne({email: user_data.email}, {$set:{token: utoken, last_ip: user_data.ip}}, (err, res) => {
                            callback({"status": "valid", "token": utoken});
                        });
                    
                    } else {
                        callback({"status": "invalid", "message": "Wrong email/password combo"});
                    }  
                })

            } else {
                callback({"status": "invalid", "message": "Account does not exist"});
            }
        });
    };

    // Checks if token is valid, nees token and ip
    const token_check = (user_data, callback) => {
        user_collection.find({token: user_data.token, last_ip: user_data.ip}).toArray((err, result) => {
            if (result.length != 0) {
                callback({"status": "valid"});
            } else {
                callback({"status": "invalid"});
            }
        });
    };

    // Gives valid user token for later use
    app.post('/login', (request, response, postdata) => {

        const data = {
            email: postdata.email,
            password: postdata.password,
            ip: request.connection.remoteAddress
        };

        console.log(postdata);
        
        user_check(data, (res) => {
            response.statusCode = 200;
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.setHeader('Content-Type', 'text/json');
            response.write(JSON.stringify(res));
            response.end();
        });
        
    });
     
    // API ENDPOINT
    const simplereq = require('./simplerequest');
    app.get('/scan', (request, response) => {
        
        // Extracts query params
        const url_query = app.extract_query(request.url);

        console.log(url_query.warp_url);
        console.log(url_query.warp_token);

        const user_data = {
            token: url_query.warp_token,
            ip: request.connection.remoteAddress
        };

        // Checks if token is valid
        token_check(user_data, (res) => {
            if (res.status === "valid" && url_query.warp_url.includes("http")) {
                simplereq.make_request(url_query.warp_url, (data) => {
                    response.statusCode = 200;
                    response.setHeader("Access-Control-Allow-Origin", "*");
                    response.setHeader('Content-Type', 'text/json');
                    response.write(JSON.stringify({ "status": "valid", "html": data}));
                    response.end();
                });
            } else {
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/json');
                response.write(JSON.stringify({ "status": "invalid" }));
                response.end();
            }
        });
    });

    const res = user_collection.find({}).toArray((err,stuff) => {
        console.log(stuff);
    });
    
    app.listen();
});