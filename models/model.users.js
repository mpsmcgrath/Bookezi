var mongoose = require('mongoose');  
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var UserSchema = new Schema({ 
  firstName: String,
  lastName: String,
  address1: String,
  address2: String,
  city: String,
  county: String,
  postcode: String,
  dob: String,
  subjectName: String,
  canSessionLength30: Boolean,
  canSessionLength60: Boolean,
  canSessionLength90: Boolean,
  canSessionLength120: Boolean,
  skillLevel: String,
  isTeacher: Boolean,
  canTeachAtHome: Boolean,
  canTeachAtCustHome: Boolean,
  canTeachAtCustom: Boolean,
  lessonDescription: String,
  biography: String,
  avatarName: String,
  local            : {
        email        : String,
        password     : String,
        firstName    : String,
        lastName     : String
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

// methods ======================
// generating a hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', UserSchema);