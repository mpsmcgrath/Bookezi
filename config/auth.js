// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : process.env.FB_CLIENTID, // your App ID
        'clientSecret'  : process.env.FB_CLIENTSECRET, // your App Secret
        'callbackURL'   : process.env.FB_CALLBACKURL
    },

    'googleAuth' : {
        'clientID'      : process.env.GOO_CLIENTID,
        'clientSecret'  : process.env.GOO_CLIENTSECRET,
        'callbackURL'   : process.env.GOO_CALLBACKURL
    }

};




