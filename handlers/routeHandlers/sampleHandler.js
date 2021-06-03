/**
 * Title: Sample  Handler
 * Description: Sample Route Handlers
 * Author: Jagadish Chakma
 * Date: 30-05-2021
 * Version: 0.1
 */

// module scaffolding
const handler = {};

// sample handler
handler.sampleHandler = (req, callBack) => {
    callBack(200, {mesage: 'Successfully data submited'});
};


// sample handler module exports
module.exports = handler;