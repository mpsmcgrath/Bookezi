var express     = require('express');
var router      = express.Router();
var User        = require('../models/model.users');
var AddEmail    = require('../models/model.addemail');

//Nodemailer
var nodemailer  = require('nodemailer');
var mg          = require('nodemailer-mailgun-transport');

// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
var auth = {auth: {api_key: 'key-fa1d0fc3a46d962e53f041917ccea81b',domain: 'mail.keepskills.com'}}
var nodemailerMailgun = nodemailer.createTransport(mg(auth));


router.use(function(req, res, next) {
    // do logging - I guess we could put a logger here? Analytics? Validation? Error responses?
    console.log('Logging middleware goes here before next() function');
    next(); // make sure we go to the next routes and don't stop here
});



// GET about page.
router.get('/about', function(req, res, next) {
  res.render('about', { 
  	title: 'About',  
  });
});

// GET contact page.
router.get('/contact', function(req, res) {
  res.render('contact', { 
    title: 'Contact',  
  });
});

// GET contact page.
router.get('/howitworks', function(req, res) {
  res.render('howitworks', { 
    title: 'How it Works',  
  });
});

//Submit contact form
router.post('/contactformsend', function(req, res){
  console.log('contact form send');
  res.json({ message: 'contact form send'})

nodemailerMailgun.sendMail({
  from: req.body.email,
  to: 'mpsmcgrath@gmail.com', // An array if you have multiple recipients.
  subject: 'Contact form: ' + ' - ' + req.body.name,
  'h:Reply-To': req.body.email,
  //You can use "html:" to send HTML email content. It's magic!
  html: req.body.message,
  //You can use "text:" to send plain-text content. It's oldschool!
 // text: 'Mailgun rocks, pow pow!'
}, function (err, info) {
  if (err) {
    console.log('Error: ' + err);
  }
  else {
    console.log('Response: ' + info);
  }
}); 

});


//delete request
  router.delete('/api/oneuser/:_id', function(req, res) {

  console.log('DELETE');
  
  User.remove({
    _id: req.params._id
  }, function(err, user) {
    if (err)
      res.send(err);

    res.json({ message : 'Successfully Deleted' });
  })
});


//Put request first of all GETs user by Object id then PUTs firstName into user and saves to db
  router.put('/api/oneuser/:_id', function(req, res, next) {

  console.log('PUT');
  
  User.findById(req.params._id, function(err, user) {
  
            if (err) res.send(err);
  
            user.firstName = req.body.firstName;
  
  console.log('PUT Request for object _id from req.params._id which is: ' + req.params._id);

            //save the user
            user.save(function(err){
              if (err) res.send(err);

              res.json({ message: 'User updated'})
            })
          })
  });


//API Routes

router.post('/api/users', function(req, res, next) {
        
        var user = new User();      // create a new instance of the User model
        user.firstName = req.body.firstName;  // set the users name (comes from the request)
        user.username = req.body.username;
        user.userid = req.body.userid;
        user.isTeacher = req.body.isTeacher;

        // save the user and check for errors
        user.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'User created!' });
        })})

      .get('/api/users', function(req, res) {
        User.find(function(err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });
    })

router.get('/api/oneuser/:_id', function(req, res, next) {
        console.log('Request for object _id from req.params._id which is: ' + req.params._id);
      User.findById(req.params._id, function(err, user) {
            if (err) res.send(err);
            res.json(user);
        });

})

//Routes for Email Mailing List
      router.get('/addemail', function(req, res) {
        AddEmail.find(function(err, emails) {
            if (err)
                res.send(err);

            res.json(emails);
            console.log('test for addemail GET');
        });
    })

      router.post('/addemail', function(req, res, next){
        var emailList = new AddEmail();      // create a new instance of the User model
        emailList.mailingListEmailAddress = req.body.mailingListEmailAddress;  // set the users name (comes from the request)
        console.log('test for POST email');
        emailList.save(function(err) {
            if (err)
                res.send(err);
        })
        res.render('addemail', { 
        title: 'Add Email Address',  
        mailingListEmailAddress : req.body.mailingListEmailAddress
  });
    });

        router.delete('/addemail/:mailingListEmailAddress', function(req, res, next) {

  console.log('DELETE');
  
  AddEmail.remove({
    mailingListEmailAddress: req.params.mailingListEmailAddress
  }, function(err, email) {
    if (err)
      res.send(err);
    console.log(req.params.mailingListEmailAddress);
    res.json({ message : 'Successfully Deleted', });
  })
});


    // =====================================
    // LOGOUT ==============================
    // =====================================
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;
