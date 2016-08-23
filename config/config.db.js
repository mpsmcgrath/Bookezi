//load mongoose to use it's connect function
var mongoose = require('mongoose');

//This is the link to our live db, using local for testing purposes
//mongoose.connect('mongodb://kpapp:HIMYNAMEISSEAN62756@ec2-52-208-78-239.eu-west-1.compute.amazonaws.com:27017/keepskills');

//link to local db for testing purposes
mongoose.connect('mongodb://localhost:27017/keepskills');

