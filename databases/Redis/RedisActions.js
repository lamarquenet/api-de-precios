const redisClient = require('./redis.js');

//empty redis db
const flushRedis = () =>{
    redisClient.flushdb((res)=>{
        logger.alert("redis DB emptied: "+res);
    })
}

//get all keys in the redis db
const getAllKeys = () =>{
    return redisClient.keys("*",(err,res) =>{
        if(err){
            return err
        }
        else {
            console.log("Redis cookies for sessions on start: "+res);
            return res
        }
    })
}

//retrieves a key
const getKey = async (key) =>{
    redisClient.get(key, function (err, res) {
        if(err){
            return err
        }
        else{
            console.log(res);
            return res
        }
    });
}

module.exports = {
    flushRedis,
    getAllKeys,
    getKey
}