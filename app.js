//Welcome to our FYP.  This code has been extensively commented throughout for readability. 
//The majority has been learned and modified examples used from various sources such as github/npm 
//and tutorial websites and videos as is standard for node-express projects

//This loads the .env config file, that has process.env variables for dev and prod
require('dotenv').config(); 

//connect flash allows the sending of success, info, warning, error messages to the UI
var flash = require('express-flash');

//loads the express app
var express     = require('express');

//loads passport for authentication
var passport    = require('passport');

//init the express app
var app         = express();

//Allows us to set our port to the env variable PORT
var port        = process.env.PORT || 8080; // set our port

//load mongoose to handle our models
var mongoose    = require('mongoose');

//handling cookies funnily enough!
var cookieParser = require('cookie-parser');

//This allows the use of the request body, for URL encoded data, JSON, etc.
var bodyParser  = require('body-parser');

//Handles the session - passportjs wraps and extends this
var session     = require('express-session');

//our connenction to our db, stored in config
var db          = require('./config/config.db');

//for working with file and directory paths
var path        = require('path');

//for serving the little favicon
var favicon     = require('serve-favicon');

//morgan for logging
var morgan      = require('morgan');

//fs for accessing the file system
var fs = require('fs');

//requires all Mongoose data models in the models directory
fs.readdirSync(__dirname + '/models').forEach(function(filename) {
  if (~filename.indexOf('.js')) require(__dirname + '/models/' + filename)
});

//Nodemailer
var nodemailer  = require('nodemailer');
var mg          = require('nodemailer-mailgun-transport');

// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
var auth = {auth: {api_key: 'key-fa1d0fc3a46d962e53f041917ccea81b',domain: 'mail.keepskills.com'}}
var nodemailerMailgun = nodemailer.createTransport(mg(auth));



// view engine setup, this is in the PATH+views directory.  View engine in use is EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//These are how we use some of the modules reqired above (location of favicon, use morgan only in dev
//mode, enables bodyparsing and cookie parsing, set the public path where our client visible files are.)
app.use(favicon(path.join(__dirname,'public','img','favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//required for passport to be secure, send flash messages, ititiate and start session
app.use(session({ secret: 'verysecuresecret', cookie: { maxAge: 6000000 }}));
app.use(flash()); 
app.use(passport.initialize());
app.use(passport.session()); 

//These are making our public and authorised routes available as well as loading the PassportJS strategies
require('./routes/route.index')(app, express);
require('./routes/route.auth')(app, passport);
require('./config/config.passport')(passport);

//global variable for web page title
app.locals.pagetitle = " - Bookezi.com";


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;
