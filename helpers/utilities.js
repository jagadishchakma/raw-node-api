/**
 * Title: Check all utilities of this function
 * Description: check all utilities of this functon
 * Author: Jagadish Chakma
 * Date: 01-06-2021
 * Version: 0.1
 */

// dependencies
const crypto = require("crypto");
const environments = require("./environments");

// module scaffolding
const utilities = {};

// parse json string to object
utilities.parseJSON = (jsonString) => {
  let output;
  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }
  return output;
};

// hash string
utilities.hash = (string) => {
  if (typeof(string) === "string" && string.length > 0) {
    const hash = crypto
      .createHmac("sha256", environments.staging.secretKey)
      .update(string)
      .digest("hex");
      return hash;
  }else{
      return false;
  }
};

// random token string
utilities.randomString  = (strLength) => {
  const length = typeof(strLength) === 'number' && strLength > 0 ? strLength : false; 
  if(length){
    const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let output = '';
    for(let i = 0; i <= strLength; i++){
      const randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
      output += randomCharacter;
    }
    return output;
  }
  return false;

};

// module exports
module.exports = utilities;
