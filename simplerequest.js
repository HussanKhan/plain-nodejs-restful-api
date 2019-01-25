module.exports = {
    make_request: (request_url, command) => {
        const https = require('https');
        const http = require('http');

        try {

            https.get(request_url, (resp) => {
                // Post data comes in stream
                let body = '';
                            
                // Data chunk detected
                resp.on('data', (chunk) => {
                    body += chunk;
                });
                
                // End of data stream detected
                resp.on('end', () => {
                    command(body);
                });
    
                // If error raised in request
                resp.on('error', (err) => {
                    console.error(err);
                });
            });

        } catch(err) {
            
            try {
                
                http.get(request_url, (resp) => {
                    // Post data comes in stream
                    let body = '';
                                
                    // Data chunk detected
                    resp.on('data', (chunk) => {
                        body += chunk;
                    });
                    
                    // End of data stream detected
                    resp.on('end', () => {
                        command(body);
                    });
        
                    // If error raised in request
                    resp.on('error', (err) => {
                        console.error(err);
                    });
                });

            } catch(err) {
                
                command("");
                
            }
        }
        
    }
}