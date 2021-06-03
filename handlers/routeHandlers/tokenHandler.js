/**
 * Title: Users Authentication Handler
 * Description: Handle authentication
 * Author: Jagadish Chakma
 * Date: 02-06-2021
 * Version: 0.1
 */

const { hash, randomString } = require("../../helpers/utilities");
const { readFile, createFile, updateFile, deleteFile } = require("../../libs/data");

// module scaffolding
const handler = {};

// user request and response handler
handler.userTokenHandler = (req, callBack) => {
  // check methods
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.includes(req.method)) {
    handler._token[req.method](req, callBack);
  } else {
    callBack(500, "Invalid Request");
  }
};

// routes token
handler._token = {};

handler._token.post = (req, callBack) => {
  const phone =
    typeof req.body.phone === "string" && req.body.phone.trim().length === 11
      ? req.body.phone
      : false;
  const password =
    typeof req.body.password === "string" && req.body.password.trim().length > 0
      ? req.body.password
      : false;
  if (phone && password) {
    readFile("users", phone, (err, userData) => {
      if (!err && userData) {
        const hashPassword = hash(password);
        if (hashPassword === userData.password) {
          const tokenId = randomString(20);
          const expires = Date.now() + 60 * 60 * 1000;
          const tokenObject = {
            tokenId,
            phone,
            expires,
          };
          createFile("token", tokenId, tokenObject, (err2) => {
            if (!err2) {
              callBack(200, tokenObject);
            } else {
              callBack(400, { error: "There was a server side error" });
            }
          });
        } else {
          callBack(400, { error: "Authentication error" });
        }
      } else {
        callBack(400, { error: "Users not found" });
      }
    });
  }
};
handler._token.get = (req, callBack) => {
  // check valid user token number
  const token =
    typeof req.query.token === "string" && req.query.token.trim().length > 0
      ? req.query.token
      : false;

  if (token) {
    readFile("token", token, (err, tokenObj) => {
      if (!err && tokenObj) {
        callBack(200, tokenObj);
      } else {
        callBack(500, { error: "There token was not found" });
      }
    });
  } else {
    callBack(500, { error: "There token was not found" });
  }
};
handler._token.put = (req, callBack) => {
  //vaidate token
  const token =
    typeof(req.headers.token) === "string" && req.headers.token.trim().length > 0
      ? req.headers.token
      : false;
  const extend =
    typeof(req.body.extend) === "boolean" && req.body.extend === true
      ? req.body.extend
      : false;
  if (token && extend) {
    readFile("token", token, (err, tokenData) => {
      const tokenObject = tokenData;
      if (!err && tokenObject.expires > Date.now()) {
        tokenObject.expires = Date.now() + 60 * 60 * 1000;
        updateFile("token", token, tokenObject, (err2) => {
          if (!err2) {
            callBack(200, { message: "Successfully Token Updated" });
          } else {
            callBack(400, { error: "There was a server side error" });
          }
        });
      } else {
        callBack(400, { error: "Token already expired" });
      }
    });
  } else {
    callBack(400, { error: "Invalid Token" });
  }
};
handler._token.delete = (req, callBack) => {
  // check valid user token 
  const token =
    typeof(req.query.token) === "string" && req.query.token.trim().length > 0
      ? req.query.token
      : false;
  if(token){
    deleteFile('token', token, (err, message) => {
      if(!err){
        callBack(200,{message: "Token deleted successfully"});
      }else{
        callBack(400,{message: 'Failed to delete token'});
      }
    });
  }else{
    callBack(400, {error: 'token number is invalid'});
  }
};

// verify token
handler._token.verify = (token, phone, callBack) => {
  readFile('token', token, (err, tokenData) => {
    if(!err && tokenData){
      if(tokenData.phone === phone && tokenData.expires > Date.now()){
        callBack(true);
      }else{
        callBack(false);
      }
    }else{
      callBack(false);
    }
  });
};
// moduel exports
module.exports = handler;
