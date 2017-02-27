// Load mongoose to handle the model, bcrypt to encrypt our cookie/password encryption, load schema object
var mongoose = require('mongoose');  
var Schema = mongoose.Schema;

// our bookings model, the user selects availability slots during the signup process, these are 'events' in FullCalendar, here we persist these events. 
var BookingSchema = new Schema({ 

availability: [{
	title: String,
	dow: Number,
	start: String,
	end: String
}]

});

// Create the model for users and expose it to our app
module.exports = mongoose.model('bookings', BookingSchema);