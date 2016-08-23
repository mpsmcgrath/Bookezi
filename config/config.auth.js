// This file exposes our authorisation config directly to our application using module.exports
// These are stored in a file called .env in the application root, there is a separate one for 
// local and for production.  This greatly simplifies the deployment process.

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




