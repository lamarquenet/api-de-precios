const mongoose = require('mongoose');
const config = require('../config');
//DB Config
const mongooseAtlas = mongoose.connect(config.getDbConnectionStringAtlas(),
    {useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true})
    .then(() => console.log('mongoDB connected...'))
    .catch(err => console.log(err));

module.exports = mongooseAtlas;