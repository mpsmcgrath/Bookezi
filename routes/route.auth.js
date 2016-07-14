var multer      = require('multer')


// app/routes.js
module.exports = function(app, passport) {

/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Home', 
  });
});

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { 
            title: 'Login',
            message: req.flash('loginMessage'),  
        }); 
    });


    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/dashboard', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));



    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { 
            title: 'Signup',
            message: req.flash('signupMessage'),  
        });
    });

    // process the signup form
     app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/createprofile', // redirect to the secure profile creation section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // CREATE PROFILE GET======================
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


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/profile_pics/')
    },

  filename: function (req, file, cb) {

//custom code to add extension to uploaded profile image png or jpg or jpeg
    var ext = '';
    if(file.mimetype == 'image/png'){
        ext = '.png'
    } else if (file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' ){
        ext = '.jpg'}

    cb(null, 'profiler' + Date.now() + ext)
        }})

var upload   = multer({ 
    limits: {fileSize: 5000000, files:1},
    storage: storage
 })

    app.post('/createprofile', upload.single("image"), isLoggedIn, function(req, res) {
 

           var file = req.file;
           console.log(file.filename);     
           var user     = req.user;
           user.avatarName = file.filename;
           user.subjectName = req.body.subjectName;
           user.canSessionLength30 = req.body.canSessionLength30;
           user.canSessionLength60 = req.body.canSessionLength60;
           user.canSessionLength90 = req.body.canSessionLength90;
           user.canSessionLength120 = req.body.canSessionLength120;
           user.skillLevel = req.body.skillLevel;
           user.canTeachAtHome = req.body.canTeachAtHome;
           user.canTeachAtCustHome = req.body.canTeachAtCustHome;           
           user.canTeachAtCustom = req.body.canTeachAtCustom;
           user.firstName = req.body.firstName;
           user.lastName = req.body.lastName;
           user.address1 = req.body.address1;
           user.address2 = req.body.address2;
           user.city = req.body.city;
           user.county = req.body.county;
           user.postcode = req.body.postcode;
           user.dob = req.body.dob;
           user.biography = req.body.biography;
           user.lessonDescription = req.body.lessonDescription; 
                                                
           message: req.flash('signupMessage'),
           user.save(function(err) {
           res.redirect('/dashboard');
        });
    });


    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // DASHBOARD SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/dashboard', isLoggedIn, function(req, res) {
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
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook 
        // send to facebook to do the authentication
        app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

        // handle the callback after facebook has authorized the user
        app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

        // handle the callback after twitter has authorized the user
        app.get('/connect/twitter/callback',
            passport.authorize('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        app.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

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
}}