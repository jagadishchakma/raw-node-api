/**
 * Title: Handle http request and response
 * Description: All http reqest and response handle shortly
 * Author: Jagadish Chakma
 * Date: 30-05-2021
 * Version: 0.1
 */

// dependencies
const { StringDecoder } = require('string_decoder');
const url = require('url');
const routes = require('../routes');
const {notFoundHandler} = require('../handlers/routeHandlers/notFoundHandler');
const { parseJSON } = require('./utilities');

// handle request and response
const handleReqRes = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimedPathName = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const queryHeaders = req.headers;
    let realData = '';

  
    // payload decoder
    const decoder = new StringDecoder('utf-8');
    req.on('data', (buffer) => {
      realData += decoder.write(buffer);
    });
    req.on('end', () => {
        realData += decoder.end();

        // decide routes handlers
        const reuestProperties = {};
        reuestProperties.headers = queryHeaders;
        reuestProperties.query = queryStringObject;
        reuestProperties.method = method;
        reuestProperties.body = parseJSON(realData);
        
        const choosenHandler = routes[trimedPathName] ? routes[trimedPathName] : notFoundHandler;
        choosenHandler(reuestProperties,(status, payload) => {
          const statusCode = typeof(status) === 'number' ? status : 500;
          const payloadObject = typeof(payload) === 'object' ? payload : {};
          const payloadString = JSON.stringify(payloadObject);
          res.setHeader('Content-Type','application/json');
          res.writeHead(statusCode);
          res.end(payloadString);
        });
    });

    
    
};


// usefull module exports
module.exports = handleReqRes;