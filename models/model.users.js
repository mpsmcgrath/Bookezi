// Load mongoose to handle the model, bcrypt to encrypt our cookie/password encryption, load schema object
var mongoose = require('mongoose');  
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

// our user model, this has been morphing since the beginning of development, 
// it's pretty self explanatory! I have used clear field names where I can. 
// the local, facebook and google embedded lists are used by PassportJS auth module
var UserSchema = new Schema({ 
  firstName: { type: String, lowercase: true, trim: true },
  lastName: { type: String, lowercase: true, trim: true },
  address1: { type: String, lowercase: true, trim: true },
  address2: { type: String, lowercase: true, trim: true },
  city: { type: String, lowercase: true, trim: true },
  county: { type: String, lowercase: true, trim: true },
  postcode: { type: String, lowercase: true, trim: true },
  dob: String,
  email: { type: String, lowercase: true, trim: true },
  backgroundChecked: { type:Boolean, default:false },
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
  averageRating: Number,
  averagePrice: { type:Number, default:30 },
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
// Use bcrypt to generate a hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// check if the password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// Create the model for users and expose it to our app
module.exports = mongoose.model('User', UserSchema);