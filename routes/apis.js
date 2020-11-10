const express = require('express');
const router = express.Router();
const apisControllers = require('../controllers/apisControllers');
const {ifAuthRedirectToDash} = require('../middlewares/auth');

router.post('/sendemail',apisControllers.sendEmail)

router.get('/getInflation/:month', apisControllers.getInflation)

module.exports = router;