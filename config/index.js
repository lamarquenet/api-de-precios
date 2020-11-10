var configValues = require("./config");

module.exports =  {
    getDbConnectionStringAtlas: function(){
        return "mongodb+srv://"+ this.atlasMongo.username+ ":"+this.atlasMongo.pwd +"@cluster0.mhtba.gcp.mongodb.net/passAuth?retryWrites=true&w=majority"
    },
    atlasMongo: {
        username: process.env.USERNAME_ATLAS? process.env.USERNAME_ATLAS : configValues.atlasMongo.username ,
        pwd: process.env.PWD_ATLAS? process.env.PWD_ATLAS : configValues.atlasMongo.pwd
    },
    facebookApi: {
        FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID? process.env.FACEBOOK_APP_ID :configValues.facebookApi.FACEBOOK_APP_ID,
        FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET? process.env.FACEBOOK_APP_SECRET :configValues.facebookApi.FACEBOOK_APP_SECRET
    },
    google: {
        accountName: process.env.ACCOUNT_NAME? process.env.ACCOUNT_NAME :configValues.google.accountName,
        clientId: process.env.CLIENT_ID? process.env.CLIENT_ID : configValues.google.clientId,
        secretKey: process.env.SECRET_KEY? process.env.SECRET_KEY :configValues.google.secretKey,
        authorisedRedirectUris: process.env.REDIRECT_URI? process.env.REDIRECT_URI :configValues.google.authorisedRedirectUris
    },
    oauth2: {
        authorizationCode: process.env.AUTHORIZATION_CODE? process.env.AUTHORIZATION_CODE :configValues.oauth2.authorizationCode,
        refreshToken: process.env.REFRESH_TOKEN? process.env.REFRESH_TOKEN :configValues.oauth2.refreshToken,
        accesstoken:process.env.ACCES_TOKEN? process.env.ACCES_TOKEN :configValues.oauth2.accesstoken,
    },
    pricesApi: {
        url: process.env.PRICE_SERVER_URL? process.env.PRICE_SERVER_URL :configValues.pricesApi.url,
        inflationUrl: process.env.INFLATION_URL? process.env.INFLATION_URL :configValues.pricesApi.inflationUrl,
        fullInflationUrl: process.env.FULL_INFLATION_URL? process.env.FULL_INFLATION_URL :configValues.pricesApi.fullInflationUrl,
    },
    server:{
        port: process.env.PORT? process.env.PORT : configValues.server.port,
        url: process.env.URL? process.env.URL : configValues.server.url
    },
    redis:{
        port: process.env.REDIS_PORT? process.env.REDIS_PORT : configValues.redis.port,
        host: process.env.REDIS_HOST? process.env.REDIS_HOST : configValues.redis.host,
        connectionString: process.env.REDIS_URL? process.env.REDIS_URL : configValues.redis.connectionString
    }
}