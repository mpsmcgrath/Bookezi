//load mongoose and create a schema object
var mongoose = require('mongoose');  
var Schema = mongoose.Schema;

//create the very small schema, containing mailinglist address and timestamp, hold it in it's own collection
var AddEmailSchema = new Schema({  
  mailingListEmailAddress: { type: String, trim: true}
},
{
    timestamps: true
}, { collection: 'email_list' });

//export the model to make it available to the app, name it AddEmail
module.exports = mongoose.model('AddEmail', AddEmailSchema);