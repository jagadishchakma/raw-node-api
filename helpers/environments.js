/**
 * Title: Environments variable
 * Description: All environments variable things
 * Author: Jagadish Chakma
 * Date: 30-05-2021
 * Version: 0.1
 */

// dependencies

// module scaffolding
const environments = {};

// staging 
environments.staging = {
    port: 4000,
    name: 'staging',
    secretKey: 'dhfkjsdfhioefkhjsd',
    maxChecks: 5,
    twilio: {
        FromPhone: '0979591794',
    },
};

// production
environments.production = {
    port: 5000,
    name: 'production',
    secretKey: 'hdfdsfysdyf',
    maxChecks: 5,
    maxChecks: 5,
    twilio: {
        FromPhone: '0979591794',
    },
};


// module exports
module.exports = environments;