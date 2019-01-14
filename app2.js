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


    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    bcrypt.hash(postdata.password, saltRounds, (err, hash) => {

        collection.find({email: postdata.email}).toArray((err,stuff) => {
            if (stuff.length == 0) {
                
                collection.insertOne({email:postdata.email, password: hash}, (err, res) => {
                    if ((!err)) {
                        console.log("SUCCESSFUL INSERT");
                        response.write("SUCCESSFUL INSERT");
                    } else {
                        console.log("FAILED INSERT");
                        response.write("FAILED INSERT");
                    }
                });

            } else {

                bcrypt.compare(postdata.password, hash, function(err, res) {
                    if (res) {
                        console.log("SUCCESSFUL MATCH");
                        response.write("SUCCESSFUL MATCH");
                    } else {
                        console.log("FAILED MATCH");
                        response.write("FAILED MATCH");
                    }
                });

            }
            response.end();
        });
        
    });  
 
});