const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersControllers');
const {ifAuthRedirectToDash} = require('../middlewares/auth');

//render pages
//Login Page
router.get('/login',ifAuthRedirectToDash, (req , res) => res.render('login'));

//Register Page
router.get('/register',ifAuthRedirectToDash, (req , res) => res.render('register'));

//api endpoints
router.get('/loginFacebook',ifAuthRedirectToDash, userController.loginFacebook);

//here is where facebook redirect the user after authenticating
router.get('/loginFacebook/callback', userController.loginFacebookCb)
//send the user his basic information
router.get('/userinfo', (req, res) => {
    if(req.user){
        res.send({email:req.user.email, name:req.user.name, role: req.user.role})
    }
    else{
        res.send()
    }
});

//logout handle for external apps
router.get('/logout', userController.logout);

//post request
//authenticate external users using passport local strategy and Flash session message, we need to use next as param
router.post('/login', userController.loginLocal);

// Register Handle
router.post('/register', userController.register);

// Register confirmation from mail
router.get('/confirmRegister', userController.confirmRegister);

module.exports = router;