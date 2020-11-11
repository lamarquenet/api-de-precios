const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const { loggers } = require('winston'); // this retrieves default all loggers configured in the logger middleware file
const logger = loggers.get('general-logger');
const bcrypt = require('bcryptjs');
const configFb = require("./index").facebookApi;
const userModel = require('../models/User');
const userToVerifyModel = require('../models/UserToVerify');
const emailSender = require('../lib/emailSender');
const emailTemplates = require("../config/emailTemplates");
const {createRandomString} = require('../lib/util');

const setPassportStrategies = (passport) =>{
    passport.use( new LocalStrategy({ usernameField: 'email'}, (email, password, done)=>{
          // Match User
      userModel.findOne({email: email})
            .then(user =>{
                if(!user){
                    return done(null, false, {message: 'That email is not registered'});
                }
                //Match password
                bcrypt.compare(password, user.password, (err, isMatch)=>{
                    if(err) throw err;

                    if(isMatch){
                        if(user.active){
                          return done(null, user)
                        }
                        else{
                          //we send a new email to the user email account to remind him of authenticating into the page
                          userToVerifyModel.findOne({"email": user.email})
                            .then(res =>{
                              if(res){
                                emailSender(emailTemplates.verification(user.email , res.verificationString));
                              }
                              else{
                                const newUserVerification = new userToVerifyModel({
                                  email: user.email,
                                  verificationString: createRandomString(20)
                                });
                                newUserVerification.save()
                                  .then(verify =>{
                                    emailSender(emailTemplates.verification(verify.email , verify.verificationString));
                                  })
                              }
                            })
                          return done(new Error('Account has not been activated, we just send you a new email for you to confirm the registration'), false, {message: 'Account has not been activated, please check your mail and confirm your registration'})
                        }
                    }
                    else{
                        return done(new Error('Password is incorrect'), false, {message: 'Password is incorrect'})
                    }
                })
            })
            .catch(err => done(err))
        })
    )

    const facebookOptions ={
        clientID: configFb.FACEBOOK_APP_ID ,
        clientSecret: configFb.FACEBOOK_APP_SECRET,
        callbackURL: '/users/loginFacebook/callback',
        profileFields: ['emails', 'name']
    }

    passport.use( new FacebookStrategy(facebookOptions , (accessToken, refreshToken, profile, done)=>{
      const email = profile.emails[0].value;
      const middleName = profile.name.middleName ? profile.name.middleName +' ' : '';
      const name = profile.name.givenName +" "+middleName + profile.name.familyName;

      userModel.findOne({email: email})
        .then(user =>{
          if(!user){
            const newUser = new userModel({
              name,
              FBname: name,
              FBtoken: accessToken,
              email,
              locallyRegistered: false,
              password: accessToken,
              active: true
            });
            //hash Password, first generate a salt of factor 10 and then hash the password with that salt
            bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt , (err, hash) =>{
              if(err) throw err;

              newUser.password = hash;
              logger.info("new FB user created: "+newUser.name);
              newUser.save()
                .then(user => {
                  return done(null, user)
                })
                .catch(err => done(err))

            }))
          }
          else{
            //if the user was register locally i update the missing data in the db
            if(user.locallyRegistered && !user.FBname){
              user.FBname = name;
              user.FBtoken = accessToken;
              if(!user.active){
                //we need to set him into active as fb certifies the user account and eliminate him from the to userToVerify DB
                user.active = true;
                userToVerifyModel.deleteOne({email: user.email});
              }
              user.save()
                .then(user =>{
                  return done(null, user)
                })
                .catch(err => done(err))
            }
            else{
              done(null, user);
            }
          }
        })
        .catch(err => done(err))
    }));
    let visits = 0;
    // serialize the user.id to save in the cookie session
    // so the browser will remember the user when login
    //check if i should only serilize the id and not the entire user
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    // deserialize the cookieUserId to user in the database
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
}

module.exports = setPassportStrategies;


