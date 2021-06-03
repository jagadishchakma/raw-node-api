/**
 * Title: Twilio api handler
 * Descriptin: Send sms  using twilio api
 * Author: Jagadish Chakma
 * Date: 03-06-2021
 * Version: 0.1
 */

// dependencies
const https = require("https");
const {staging} =  require('./environments');

// module scaffolding
const notifications = {};

// send sms to user using twilio api
notifications.sendTwilioSms = (phone, msg, callBack) => {
  // inpout validation
  const userPhone =
    typeof phone === "string" && phone.trim().length === 11
      ? phone.trim()
      : false;
  const userMsg =
    typeof msg === "string" && msg.trim().length > 0 && msg.trim() <= 1600
      ? msg.trim()
      : false;

  if (userPhone && userMsg) {
      // configuration the request payload
      const payload = {
        From: staging.twilio.FromPhone,
        To: `+88${userPhone}`,
        Body: userPhone,
      };
  } else {
    callBack("User input value is invalid");
  }
};

// export the module
module.exports = notifications;
