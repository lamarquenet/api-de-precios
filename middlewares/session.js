const session = require('express-session');
const connectRedis = require('connect-redis');
const RedisStore = connectRedis(session);
const redisClient = require('../databases/Redis/redis');

const sessionInstance = session({
    store: new RedisStore({ client: redisClient }), //hook the session manager with the redis client db
    secret: 'secretwordgenerator',
    saveUninitialized: false,
    resave: false, //don't overwrite session if nothing was changed
    name: 'sessionId', //change cookie name so an attacker cannot infer you are using node and express session
    cookie: {
        secure: false, //if this is true only transmit cookie in https, it should be true for production
        httpOnly: true, //if true: prevents client side JS from reading the cookie, always true
        maxAge: 1000 * 60 * 60 * 24 * 30, //define in ms how long is the cookie valid, 30 days here
    }
})

module.exports = sessionInstance;