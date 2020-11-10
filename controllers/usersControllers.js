const bcrypt = require('bcryptjs');
const passport = require('passport');
const userModel = require('../models/User');
const userToVerifyModel = require('../models/UserToVerify');
const { loggers } = require('winston'); // this retrieves default all loggers configured in the logger middleware file
const logger = loggers.get('general-logger');
const {registerValidation, loginValidation } = require('../lib/joiValidations');
const {createRandomString} = require('../lib/util');
const emailSender = require('../lib/emailSender');
const emailTemplates = require("../config/emailTemplates");

//Get handlers with middleware
const loginFacebook = (req, res, next)=>{
    const params = req.query;
    req.session.redirectTo = params.redirectTo? params.redirectTo: '/';
    req.session.redirectOnFail = params.redirectOnFail ? params.redirectOnFail :'/users/login';

    passport.authenticate('facebook',{
        scope:['email']
    })(req, res, next);
}
//what to do after facebook make a call back to us telling if it was or not succesfull the login using facebook
const loginFacebookCb = (req, res, next) =>{
    passport.authenticate('facebook', {
        successRedirect: req.session.redirectTo,
        failureRedirect: req.session.redirectOnFail,
        failureFlash: true
    })(req, res, next);
}

const loginLocal = (req, res, next) =>{
    const {email, password} = req.body;
    const {error} = loginValidation.validate(req.body);
    let errors = []
    if(error){
        errors.push({msg: error.details[0].message});
        logger.verbose("user input incorrect data while registering: "+ errors[0].msg);
    }

    if(errors.length > 0){
        if(req.query.type === "sendResults"){
            res.status(403).send(errors[0].msg);
        }
        else{
            res.render('login', {
                errors,
                email,
                password,
            })
        }
    }
    else{
        if(req.query.type === "sendResults"){
            passport.authenticate('local',function (err, account) {
                if(err){
                    res.status(404).send(err)
                }else if(account){
                    req.logIn(account, function() {
                        res.status(err ? 500 : 200).send(err ? err : {name: account.name , email: account.email, role:account.role});
                    });
                }
                else{
                    res.status(404).send('User not found')
                }
            })(req, res, next);
        }
        else{
            passport.authenticate('local', {
                successRedirect: req.session.redirectTo,
                failureRedirect: '/users/login',
                failureFlash: true
            })(req, res, next);
        }
    }
}
//in case we are using our views to redirect the authenticated user
const logout = (req, res) =>{
    req.logout();
    resHelper('You are logged out',res ,req);
}

const resHelper = (msg, res , req, statusCode = 200)=>{
    req.session.redirectTo = req.query.redirectTo? req.query.redirectTo: "/users/login";
    req.session.redirectOrSendresults = req.query.type? req.query.type : "redirect";
    let msgtype = 'success_msg';
    if(statusCode >= 300){
        logger.error(msg);
        res.status(statusCode);
        msgtype = 'error_msg';
    }
    if(req.session.redirectOrSendresults === "sendResults"){
        res.send(msg);
    }
    else{
        req.flash(msgtype, msg);
        if(msgtype === 'error_msg'){
            res.redirect(req.query.redirectOnFail? req.query.redirectOnFail : req.session.redirectTo);
        } else{
            res.redirect(req.session.redirectTo);
        }
    }
}
//Post handlers:
// Register Handle
const register = (req, res) =>{
    const {name , email, password, password2} = req.body;
    //validation using joi schemas
    const {error} = registerValidation.validate(req.body);

    let errors = []
    if(error){
        errors.push({msg: error.details[0].message});
        logger.verbose("user input incorrect data while registering: "+ errors[0].msg);
    }

    if(errors.length > 0){
        if(req.query.type === 'sendResults'){
            res.status(403).send(errors[0].msg)
        }else{
            res.render('register', {
                errors,
                name,
                email,
                password,
                password2
            })
        }
    }
    else{
        //validation passed
        user.find({email})
            .then(user =>{
                if(user && user.locallyRegistered){
                    //user exists
                    errors.push({msg: 'Email is already registered'})
                    if(req.query.type === 'sendResults'){
                        res.status(403).send(errors[0].msg)
                    }else{
                        res.render('register', {
                            errors,
                            name,
                            email,
                            password,
                            password2
                        })
                    }
                }
                else if(user){
                    //in this case the user was registered using an external account and now is trying to register using mail
                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(password, salt , (err, hash) =>{
                        if(err) throw err;
                        user.locallyRegistered = true;
                        user.password = hash;
                        user.active = true;
                        logger.info("A facebook user updated his password: "+user.name);
                        user.save()
                            .then(user => {
                                resHelper("Successfully registered, you can login",res, req)
                            })
                            .catch(err => resHelper(err,res,req,500))
                    }))
                }
                else{
                    const newUser = new userModel({
                        name,
                        email,
                        locallyRegistered: true,
                        password
                    });
                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt , (err, hash) =>{
                        if(err) throw err;

                        newUser.password = hash;
                        logger.info("new email user registered: "+newUser.name);
                        const newUserVerification = new userToVerifyModel({
                            email: newUser.email,
                            verificationString: createRandomString(20)
                        });
                        newUserVerification.save()
                            .then(userToverify =>{
                              const redirectTo = req.query.redirectTo ? req.query.redirectTo : '/';
                              const redirectOnFail = req.query.redirectOnFail ? req.query.redirectOnFail : '/users/login';
                              const emailOptions = emailTemplates.verification(newUser.email , userToverify.verificationString, redirectTo, redirectOnFail );
                              emailSender(emailOptions);
                              newUser.save()
                                .then(user => {
                                    resHelper("Successfully registered, verify your email to confirm account",res, req)
                                })
                                .catch(err => {
                                    resHelper(err,res,req,500)
                                })
                          })
                          .catch(err => {
                              resHelper(err,res,req,500);
                          })

                    }))
                }
            });
    }
}

//in case we are using our views to redirect the authenticated user
const confirmRegister = async (req, res, next) =>{
    if(req.query.confirmCode){
        //find the user verification string on the usertoverify collection
        let errors = [];
        try {
            const userToConfirm = await userToVerifyModel.find({verificationString: req.query.confirmCode});
            const user = await userModel.find({email:userToConfirm.email});
            await userToVerifyModel.deleteOne({email: userToConfirm.email});
            if(user && !user.active) {
                user.active = true;
                await user.save();
            }
        } catch (err) {
            errors.push({msg: 'There was an issue while trying to confirm your account'})
            logger.error(err.message);
        } finally {
            if(errors){
                const failredirect = req.query.redirectOnFail? req.query.redirectOnFail : req.query.redirectTo;
                res.render('verified', {redirect: failredirect, errors:errors})
            } else{
                res.render('verified', {redirect:req.query.redirectTo, success_msg:"Your user has been confirmed successfully"})
            }
        }
    }
    else{
        resHelper('Missing confirmation code',res, req, 404)
    }
}

module.exports = {
    loginFacebook,
    loginFacebookCb,
    loginLocal,
    logout,
    register,
    confirmRegister
}