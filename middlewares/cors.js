var cors = require('cors');
var config = require('../config');

var whitelist = ['http://localhost:5000', 'https://localhost:5000', 'http://localhost:3000', 'http://192.168.176.1', 'https://tu-mejor-precio.herokuapp.com:'+config.server.port ]
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