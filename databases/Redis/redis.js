const redis = require('redis');
const config = require('../../config');
const {loggers} = require('winston');
const logger = loggers.get('general-logger');

//Redist config for session management, we use Redis to handle sessions and store cookies on the fast access redist
let redisClient = redis.createClient(config.redis.connectionString);

logger.info("redis client created");


// authenticate when we use a redist that is not develop local
/*redisClient.auth(config.redisLab.redisAuth, function(err, response){
    if(err){
        throw err;
    }
    console.log("redis client authenticated");
});*/

module.exports = redisClient;