const express = require('express');
const router = express.Router();
const path = require("path");
const {ifAuthRedirectToDash , ensureAuth} = require('../middlewares/auth');

//welcome Page
router.get('/', (req , res) =>
  res.sendFile(path.join(__dirname, "../public", "index.html"),{email: req.email})
);

module.exports = router;