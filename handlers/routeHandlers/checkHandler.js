/**
 * Title: user check handler
 * Description: user check handler api
 * Author: Jagadish Chakma
 * Date: 03-04-2021
 * Version: 0.1
 */

const { hash, randomString } = require("../../helpers/utilities");
const { _token } = require("./tokenHandler");
const {
  readFile,
  createFile,
  updateFile,
  deleteFile,
} = require("../../libs/data");
const { staging } = require("../../helpers/environments");

// module scaffolding
const handler = {};

// user request and response handler
handler.checkHandler = (req, callBack) => {
  // check methods
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.includes(req.method)) {
    handler._check[req.method](req, callBack);
  } else {
    callBack(500, "Invalid Request");
  }
};

handler._check = {};

// all routes
handler._check.post = (req, callBack) => {
  // upcoming request data validation
  const protocol =
    typeof req.body.protocol === "string" &&
    ["http", "https"].includes(req.body.protocol)
      ? req.body.protocol
      : false;
  const url =
    typeof req.body.url === "string" && req.body.url.trim().length > 0
      ? req.body.url
      : false;
  const method =
    typeof req.body.method === "string" &&
    ["get", "post", "put", "delete"].indexOf(req.body.method.toLowerCase()) > -1
      ? req.body.method
      : false;
  const successCodes =
    typeof req.body.successCodes === "object" &&
    req.body.successCodes instanceof Array
      ? req.body.successCodes
      : false;
  const timeoutSeconds =
    typeof req.body.timeoutSeconds === "number" &&
    req.body.timeoutSeconds % 2 === 0 &&
    req.body.timeoutSeconds >= 1 &&
    req.body.timeoutSeconds <= 5
      ? req.body.timeoutSeconds
      : false;

  if (protocol && url && method && successCodes && timeoutSeconds) {
    // user auth check
    const token =
      typeof req.headers.token === "string" ? req.headers.token : false;
    readFile("token", token, (err1, tokenData) => {
      if (!err1 && tokenData) {
        const tokenPhone = tokenData.phone;
        // lookup the user data
        readFile("users", tokenPhone, (err2, userData) => {
          if (!err2 && userData) {
            // verify token
            _token.verify(token, tokenPhone, (auth) => {
              if (auth) {
                const userObject = { ...userData };
                const userChecks =
                  typeof userObject.checks === "object" &&
                  userObject.checks instanceof Array
                    ? userObject.checks
                    : [];
                if (userChecks.length < staging.maxChecks) {
                  const checkId = randomString(20);
                  const checkObject = {
                    checkId,
                    phone: tokenPhone,
                    protocol,
                    url,
                    method,
                    successCodes,
                    timeoutSeconds,
                  };

                  // save checks
                  createFile("checks", checkId, checkObject, (err3) => {
                    if (!err3) {
                      // users check id add
                      userObject.checks = userChecks;
                      userObject.checks.push(checkId);
                      updateFile("users", tokenPhone, userObject, (err4) => {
                        if (!err4) {
                          callBack(200, userObject);
                        } else {
                          callBack(500, {
                            error: "There was a server side error",
                          });
                        }
                      });
                    } else {
                      callBack(500, { error: "There was a server side error" });
                    }
                  });
                } else {
                  callBack(401, { error: "Users has reacd max" });
                }
              } else {
                callBack(400, {
                  errpr: "Users seesion expiresd, please log in",
                });
              }
            });
          } else {
            callBack(403, { errpr: "User not found" });
          }
        });
      } else {
        callBack(403, { error: "Authentication Failed" });
      }
    });
  } else {
    callBack(400, { error: "Input Invalid" });
  }
};

handler._check.get = (req, callBack) => {
  const checkId =
    typeof req.query.checkId === "string" ? req.query.checkId : false;
  if (checkId) {
    readFile("checks", checkId, (err, checkData) => {
      if (!err && checkData) {
        const token =
          typeof req.headers.token === "string" ? req.headers.token : false;
        _token.verify(token, checkData.phone, (auth) => {
          if (auth) {
            callBack(200, checkData);
          } else {
            callBack(401, { error: "Auth Error" });
          }
        });
      } else {
        callBack(400, { error: "You have a problem bad request" });
      }
    });
  } else {
    callBack(400, { error: "You have a problem bad request" });
  }
};

handler._check.put = (req, callBack) => {
  const checkId =
    typeof req.body.checkId === "string" ? req.body.checkId : false;
  if (checkId) {
    const protocol =
      typeof req.body.protocol === "string" &&
      ["http", "https"].includes(req.body.protocol)
        ? req.body.protocol
        : false;
    const url =
      typeof req.body.url === "string" && req.body.url.trim().length > 0
        ? req.body.url
        : false;
    const method =
      typeof req.body.method === "string" &&
      ["get", "post", "put", "delete"].indexOf(req.body.method.toLowerCase()) >
        -1
        ? req.body.method
        : false;
    const successCodes =
      typeof req.body.successCodes === "object" &&
      req.body.successCodes instanceof Array
        ? req.body.successCodes
        : false;
    const timeoutSeconds =
      typeof req.body.timeoutSeconds === "number" &&
      req.body.timeoutSeconds % 2 === 0 &&
      req.body.timeoutSeconds >= 1 &&
      req.body.timeoutSeconds <= 5
        ? req.body.timeoutSeconds
        : false;

    if (protocol || url || method || successCodes || timeoutSeconds) {
      readFile("checks", checkId, (err, checkData) => {
        if (!err && checkData) {
          // verify token
          const token =
            typeof req.headers.token === "string" &&
            req.headers.token.length > 0
              ? req.headers.token
              : false;
          console.log(req.headers.token);
          _token.verify(token, checkData.phone, (auth) => {
            if (auth) {
              const userCheckData = { ...checkData };
              if (protocol) {
                userCheckData.protocol = protocol;
              }
              if (url) {
                userCheckData.url = url;
              }
              if (method) {
                userCheckData.method = method;
              }
              if (successCodes) {
                userCheckData.successCodes = successCodes;
              }
              if (timeoutSeconds) {
                userCheckData.timeoutSeconds = timeoutSeconds;
              }
              updateFile("checks", checkId, userCheckData, (err) => {
                if (!err) {
                  callBack(200, userCheckData);
                } else {
                  callBack(400, { error: "Failed to update" });
                }
              });
            } else {
              callBack(401, { error: "Authenticatin Failed" });
            }
          });
        } else {
          callBack(400, { error: "Invalid ID" });
        }
      });
    } else {
      callBack(400, { error: "You must provide at least one filed" });
    }
  } else {
    callBack(400, { error: "Invalid check id" });
  }
};

handler._check.delete = (req, callBack) => {
  const checkId =
    typeof req.body.checkId === "string" && req.body.checkId.length > 0
      ? req.body.checkId
      : false;
  if (checkId) {
    readFile("checks", checkId, (err, checkData) => {
      if (!err && checkData) {
        // verify tokne
        const token =
          typeof req.headers.token === "string" && req.headers.token.length > 0
            ? req.headers.token
            : false;
        _token.verify(token, checkData.phone, (auth) => {
            if(auth){
                deleteFile('checks', checkId, (err) => {
                    if(!err){
                        callBack(200, {message: 'Success deleted check id'});
                    }else{
                        callBack(400, {error: 'There was a server sid error'});
                    }
                });
            }else{
                callBack(401, { error: "Authentication Error" });
            }
        });
      } else {
        callBack(400, { error: "Check id not found" });
      }
    });
  } else {
    callBack(400, { error: "Invalid Check ID" });
  }
};

module.exports = handler;
