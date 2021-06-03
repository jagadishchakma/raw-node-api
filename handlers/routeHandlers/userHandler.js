/**
 * Title: Users handler api
 * Description: Users all routes api handler
 * Author: Jagadish Chakma
 * Date: 01-05-2021
 * Version: 0.1
 */

const { hash } = require("../../helpers/utilities");
const { _token } = require("./tokenHandler");
const {
  readFile,
  createFile,
  updateFile,
  deleteFile,
} = require("../../libs/data");

// module scaffolding
const handler = {};

// user request and response handler
handler.userHandler = (req, callBack) => {
  // check methods
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.includes(req.method)) {
    handler._users[req.method](req, callBack);
  } else {
    callBack(500, "Invalid Request");
  }
};

handler._users = {};
handler._users.post = (req, callBack) => {
  const firstName =
    typeof req.body.firstName === "string" &&
    req.body.firstName.trim().length > 0
      ? req.body.firstName
      : false;
  const lastName =
    typeof req.body.lastName === "string" && req.body.lastName.trim().length > 0
      ? req.body.lastName
      : false;
  const phone =
    typeof req.body.phone === "string" && req.body.phone.trim().length === 11
      ? req.body.phone
      : false;
  const password =
    typeof req.body.password === "string" && req.body.password.trim().length > 0
      ? req.body.password
      : false;
  const tosAgreement =
    typeof req.body.tosAgreement === "string" &&
    req.body.tosAgreement.trim().length > 0
      ? req.body.tosAgreement
      : false;
  if (firstName && lastName && phone && password && tosAgreement) {
    readFile("users", phone, (err, result) => {
      if (err) {
        let userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };

        // store the db
        createFile("users", phone, userObject, (err2) => {
          if (!err2) {
            callBack(200, { message: "Success to create" });
          } else {
            callBack(400, { error: err2 });
          }
        });
      } else {
        callBack(500, { error: "Users already exist" });
      }
    });
  } else {
    callBack(500, { error: "Invalid users" });
  }
};
//@todo authenticate
handler._users.get = (req, callBack) => {
  // check valid user phone number
  const phone =
    typeof req.query.phone === "string" && req.query.phone.trim().length === 11
      ? req.query.phone
      : false;
  // verfy token
  const token =
    typeof req.headers.token === "string" ? req.headers.token : false;

  _token.verify(token, phone, (auth) => {
    if (auth) {
      if (phone) {
        readFile("users", phone, (err2, user) => {
          if (!err2 && user) {
            callBack(200, user);
          } else {
            callBack(500, { error: "There user was not found" });
          }
        });
      } else {
        callBack(500, { error: "There user was not found" });
      }
    } else {
      callBack(403, { error: "Authentication Failed" });
    }
  });
};
//@todo authenticate
handler._users.put = (req, callBack) => {
  // check valid user phone number
  const firstName =
    typeof req.body.firstName === "string" &&
    req.body.firstName.trim().length > 0
      ? req.body.firstName
      : false;
  const lastName =
    typeof req.body.lastName === "string" && req.body.lastName.trim().length > 0
      ? req.body.lastName
      : false;
  const phone =
    typeof req.body.phone === "string" && req.body.phone.trim().length === 11
      ? req.body.phone
      : false;
  const password =
    typeof req.body.password === "string" && req.body.password.trim().length > 0
      ? req.body.password
      : false;
  // verfy token
  const token =
    typeof req.headers.token === "string" ? req.headers.token : false;

  _token.verify(token, phone, (auth) => {
    if (auth) {
      if (phone) {
        // find user
        readFile("users", phone, (err, user) => {
          let userData = user;
          if (!err && user) {
            if (firstName) {
              user.firstName = firstName;
            }
            if (lastName) {
              user.lastName = lastName;
            }
            if (password) {
              user.password = hash(password);
            }
          } else {
            callBack(400, { error: "Users is invalid" });
          }

          // store update data
          updateFile("users", phone, userData, (err2) => {
            if (!err2) {
              callBack(200, { message: "There are update successfull" });
            } else {
              callBack(400, { error: "Error update failed" });
            }
          });
        });
      } else {
        callBack(400, { error: "Users is invalid" });
      }
    } else {
      callBack(403, { error: "Authentication Failed" });
    }
  });
};
//@todo authenticate
handler._users.delete = (req, callBack) => {
  // check valid user phone number
  const phone =
    typeof req.query.phone === "string" && req.query.phone.trim().length === 11
      ? req.query.phone
      : false;
  // verfy token
  const token =
    typeof req.headers.token === "string" ? req.headers.token : false;

  _token.verify(token, phone, (auth) => {
    if (auth) {
      if (phone) {
        deleteFile("users", phone, (err, message) => {
          if (!err) {
            callBack(200, message);
          } else {
            callBack(400, message);
          }
        });
      } else {
        callBack(400, { error: "Phone number is invalid" });
      }
    } else {
      callBack(403, { error: "Authentication Failed" });
    }
  });
};

// module exports
module.exports = handler;
