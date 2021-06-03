/**
 * Title: Raw Node Projects API
 * Description: Using raw node make a full api porjects
 * Author: Jagadish Chakma
 * Date: 30-5-2021
 * Version: 0.1
 */

// dependencies
const http = require('http');
const handleReqRes = require('./helpers/handleReqRes');
const data = require('./libs/data');



// app object - module scaffolding
const app = {};


// configuration
const config = {};
config.port = 5000;

// create a server
app.createServer = () => {
    const server = http.createServer(handleReqRes);
    server.listen(config.port, () => {
        console.log(`server is running on port ${config.port}`);
    });
};


// server method call
app.createServer();