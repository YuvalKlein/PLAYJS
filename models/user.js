var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
    
var UserSchema = new mongoose.Schema({
   username: String,
   email: String,
   image: String,
   isAdmin: {type: Boolean, default: false},
   isInstructor: {type: Boolean, default: false},
   password: String,
   resetPasswordToken: String,
   resetPasswordExpires: Date,
   firstname: String,
   lastname: String,
   avatar: String,
   created: {type: Date, default: Date.now}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);