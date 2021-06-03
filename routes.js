/**
 * Title: Application Routes
 * Description: All routes here wil be vissible
 * Author: Jagadish Chakma
 * Date: 30-5-2021
 * Version: 0.1
 */

// dependencies
const {sampleHandler} = require('./handlers/routeHandlers/sampleHandler');
const { userHandler } = require('./handlers/routeHandlers/userHandler');
const { userTokenHandler } = require('./handlers/routeHandlers/tokenHandler');
const { checkHandler } = require('./handlers/routeHandlers/checkHandler');

// routes object

const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: userTokenHandler,
    check: checkHandler,
};


// routes module exports
module.exports = routes;