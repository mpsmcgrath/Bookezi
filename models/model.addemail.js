var mongoose = require('mongoose');  
var Schema = mongoose.Schema;

var AddEmailSchema = new Schema({  
  mailingListEmailAddress: { type: String, trim: true}
},
{
    timestamps: true
}, { collection: 'email_list' });

module.exports = mongoose.model('AddEmail', AddEmailSchema);