require('dotenv').config(); 
var flash       = require('connect-flash');
var express     = require('express');
var passport    = require('passport');
var app         = express();
var port        = process.env.PORT || 8080; // set our port
var mongoose    = require('mongoose');
var morgan      = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser  = require('body-parser');
var session     = require('express-session');
var db          = require('./models/db');
var path        = require('path');
var favicon     = require('serve-favicon');
var logger      = require('morgan');
var User        = require('./models/model.users')
var routes      = require('./routes/index');

//Nodemailer
var nodemailer  = require('nodemailer');
var mg          = require('nodemailer-mailgun-transport');

// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
var auth = {auth: {api_key: 'key-fa1d0fc3a46d962e53f041917ccea81b',domain: 'mail.keepskills.com'}}
var nodemailerMailgun = nodemailer.createTransport(mg(auth));



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//set up express application
app.use(favicon(path.join(__dirname,'public','img','favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//required for passport
app.use(session({ secret: 'verysecuresecret' }));
app.use(flash()); 
app.use(passport.initialize());
app.use(passport.session()); 

require('./routes/route.auth.js')(app, passport);
require('./config/passport')(passport);

//start the server and listen on port described above
app.listen(port);
console.log('Magic happens on port ' + port);

app.locals.pagetitle = " - KeepSkills.com";


app.use('/', routes);
app.use('/about', routes);
app.use('/contact', routes);
app.use('/login', routes);
app.use('/signup', routes);
app.use('/api', routes);


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
