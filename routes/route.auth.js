var AddEmail    = require('../models/model.addemail')
var User    = require('../models/model.users')
var Bookings    = require('../models/model.bookings')
//Nodemailer for the contact form
var nodemailer  = require('nodemailer');
var mg          = require('nodemailer-mailgun-transport');
// API key from mailgun.com/cp (free 10K of monthly emails) - used with Nodemailer
var auth        = {auth: {api_key: 'key-fa1d0fc3a46d962e53f041917ccea81b',domain: 'mail.keepskills.com'}}
var nodemailerMailgun = nodemailer.createTransport(mg(auth));
// requiring multer for file uploads from the user - in this case for profile pics
var multer      = require('multer')
// these are used for adding a date and the correct extention to uploaded profile pics
var ext = '';
var profilePicDate = '';

// All protected routes are wrapped in a function which is passed app and passport (PassportJS)
module.exports = function(app, passport) {

// GET home page.
app.get('/', function(req, res) {

    title: 'Home'
    res.render('index', {expressFlash: req.flash('success')});
});


    // =====================================
    // SEARCH  =============================
    // =====================================
    // POST the search query
app.post('/search', function(req, res){
  var subject
  var location
    User.find({ 'city':req.body.location, 'subjectName':req.body.subject },function(err, users){
     if( !err ) {
            myresults = users
             console.log(myresults);
             res.render('searchresults', {
                expressFlash:req.flash('success'),
                subject : req.body.subject,
                location : req.body.location
            });
        } else {
            return console.log( err );
        }   
    })
})



    // =====================================
    // LOGIN ===============================
    // =====================================
    // GET the login form
    app.get('/login', function(req, res) {
        
    // render the page and pass in any flash data if it exists
        res.render('login.ejs', { 
            title: 'Login',
            message: req.flash('loginMessage'),  
        }); 
    });

    // POST the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));



    // =====================================
    // SIGNUP ==============================
    // =====================================
    // GET the signup form
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { 
            title: 'Signup',
            message: req.flash('signupMessage'),  
        });
    });

    // POST the signup form
     app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/createprofile', // redirect to the secure profile creation section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));



    // =====================================
    // CREATE PROFILE ======================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/createprofile', isLoggedIn, function(req, res) {
        res.render('createprofile.ejs', {
            user : req.user, // get the user out of session and pass to template
            message: req.flash('signupMessage'),
            title: 'Create Profile'
        });



    });


    // =====================================
    // PROFILE PIC UPLOAD ==================
    // =====================================
// Use multer to create storage object using diskStorage function.   
var storage = multer.diskStorage({
    // Public destination for our profile pics
  destination: function (req, file, cb) {
    cb(null, 'public/img/profile_pics/')
    },
    // Each file name needs to be unique 
  filename: function (req, file, cb) {

// Custom code to add extension to uploaded profile image png or jpg or jpeg
    ext = '';
    if(file.mimetype == 'image/png'){
        ext = '.png'
    } else if (file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' ){
        ext = '.jpg'
    }

        // Generate a date and add the date and correct extension to the file
    profilePicDate = Date.now();
    cb(null, 'profiler' + profilePicDate + ext)
        }})
// Limit on file size for security - in case someone sends a vast file and crashes the app
var upload   = multer({ 
    limits: {fileSize: 5000000, files:1},
    storage: storage
 })

    // =====================================
    // CREATE PROFILE FORM =================
    // =====================================
// POST the createprofile form, including upload the image, check if logged in

    var storedEvents = []

    app.post('/createprofile', upload.single("image"), isLoggedIn, function(req, res) {
 
 //bodyparser will store everything in req.body and here we pass it to our user session
 //then save to our database user.save() and redirect to dashboard
           console.log(req.body); 
           var file = req.file;    
           var user     = req.user;
           user.avatarName = 'profiler'+profilePicDate+ext; 
           user.subjectName = req.body.subjectName;
           user.canSessionLength30 = req.body.canSessionLength30;
           user.canSessionLength60 = req.body.canSessionLength60;
           user.canSessionLength90 = req.body.canSessionLength90;
           user.canSessionLength120 = req.body.canSessionLength120;
           user.skillLevel = req.body.skillLevel;
           user.canTeachAtHome = req.body.canTeachAtHome;
           user.canTeachAtCustHome = req.body.canTeachAtCustHome;           
           user.canTeachAtCustom = req.body.canTeachAtCustom;
           user.title = req.body.title;
           user.firstName = req.body.firstName;
           user.lastName = req.body.lastName;
           user.address1 = req.body.address1;
           user.address2 = req.body.address2;
           user.city = req.body.city;
           user.county = req.body.county;
           user.postcode = req.body.postcode;
           user.dob = req.body.dob;
           if (user.local.email) {user.email = user.local.email } else if (user.facebook.email) { user.email = user.facebook.email} else if (user.google.email) { user.email = user.google.email};
           user.biography = req.body.biography;
           user.lessonDescription = req.body.lessonDescription; 
           console.log(user); 
           message: req.flash('signupMessage'),
           user.save(function(err) { if (err) { res.redirect('/createprofile'); }});
        

// Send user welcome email 
nodemailerMailgun.sendMail({
  from: 'signup@KeepSkills.com',
  to: user.email, // An array if you have multiple recipients.
  subject: 'Welcome to KeepSkills ' + user.firstName,
  'h:Reply-To': 'sean@keepskills.com',
  //HTML email content can be sent straight from the message variable
  //html: req.body.message,
  //You can use plain "text:" either
    text: 'Congratulations on setting up the welcome email' 
}, function (err, info) {
  if (err) {
    console.log('Error: ' + err);
  }
  else {
    console.log('Response: ' + info);
  }
}); //end of send user email

            res.redirect('/dashboard');
    }); //end of app.post('createprofile')


    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)

    app.get('/profile', isLoggedIn, function(req, res) {
               console.log('************req.user************************************************')
               console.log(req.user)
               console.log('************req.user END************************************************')
               
        res.render('profile.ejs', {
            user : req.user, 
})
});


    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // DASHBOARD SECTION ===================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/dashboard', isLoggedIn, function(req, res) {
            console.log(req.user),
            console.log('---------'),
            console.log(req.session),
        res.render('dashboard.ejs', {
            user : req.user, // get the user out of session and pass to template
            message: req.flash('signupMessage'),
            title: 'Dashboard'

        });
    });






 // =============================================================================
 // AUTHENTICATE (FIRST LOGIN) ==================================================
 // =============================================================================
     // =====================================
     // FACEBOOK ROUTES =====================
     // =====================================
     // route for facebook authentication and login
     app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

     // handle the callback after facebook has authenticated the user
     app.get('/auth/facebook/callback',
         passport.authenticate('facebook', {
             successRedirect : '/createprofile',
             failureRedirect : '/signup'
         }));

  // =====================================
     // GOOGLE ROUTES =======================
     // =====================================
     // send to google to do the authentication
     // profile gets us their basic information including their name
     // email gets their emails
     app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

     // the callback after google has authenticated the user
     app.get('/auth/google/callback',
             passport.authenticate('google', {
                     successRedirect : '/createprofile',
                     failureRedirect : '/signup'
             }));


// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------

        app.get('/connect', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect', passport.authenticate('local-signup', {
            successRedirect : '/dashboard', // redirect to the secure profile section
            failureRedirect : '/SIGNUP', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook --------------------------------

        app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

        // handle the callback after facebook has authorized the user
        app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/dashboard',
                failureRedirect : '/'
            }));


    // google ---------------------------------

        app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        app.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/dashboard',
                failureRedirect : '/'
            }));


 //=============================================================================
 //UNLINK ACCOUNTS =============================================================
 //=============================================================================
 //used to unlink accounts. for social accounts, just remove the token
 //for local account, remove email and password
 //user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
           res.redirect('/profile');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
           res.redirect('/profile');
        });
    });


// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}

}