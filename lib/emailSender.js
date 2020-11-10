const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const config = require('../config');
const { loggers } = require('winston'); // this retrieves default all loggers configured in the logger middleware file
const logger = loggers.get('general-logger');

//setting oauth2Client
const myOAuth2Client = new OAuth2(
  config.google.clientId,
  config.google.secretKey,
)
//set the refresh token method, it uses the refresh token from oatuh playground
myOAuth2Client.setCredentials({
  refresh_token:config.oauth2.refreshToken
});
//refresh token when it expires
const myAccessToken = myOAuth2Client.getAccessToken()

//now we set up the nodemailer that will use the google smtp server that we will set up in our application in google
const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: config.google.accountName, //your gmail account you used to set the project up in google cloud console"
    clientId: config.google.clientId,
    clientSecret: config.google.secretKey,
    refreshToken: config.oauth2.refreshToken,
    accessToken: myAccessToken //access token variable we defined earlier
  }
});

const sendMailTo = (mailOptions , callback = null)=>{
  transport.sendMail(mailOptions,function(err,result){
    if(callback){
      if(err){
        logger.error("Error while sending confirmation mail to: "+ mailOptions.to)
        callback(err);
      }else{
        logger.info("Register confirmation mail sent to: "+ mailOptions.to)
        transport.close();
        callback(null, 'Email has been sent: check your inbox!');
      }
    }
    else{
      if(err){
        logger.error("Error while sending confirmation mail to: "+ mailOptions.to)
      }
      else{
        logger.info("Register confirmation mail sent to: "+ mailOptions.to)
      }
      transport.close();
    }
  });
}

module.exports = sendMailTo;