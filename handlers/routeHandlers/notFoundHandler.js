/**
 * Title: Not Found Handler
 * Description: Route Not Found Handlers
 * Author: Jagadish Chakma
 * Date: 30-05-2021
 * Versin: 0.1
 */

// module scaffolding
const handler = {};

// not found handler
handler.notFoundHandler = (req, callBack) => {
    callBack(200, {mesage: 'Not Found data submited'});
};

// module exports
module.exports = handler;
