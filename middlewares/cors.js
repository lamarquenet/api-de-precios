var cors = require('cors');
var config = require('../config');

var whitelist = ['https://tu-mejor-precio.herokuapp.com' ]
var corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}

module.exports = cors(corsOptions);