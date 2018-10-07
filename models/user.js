var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
    
var UserSchema = new mongoose.Schema({
   username: String,
   email: String,
   isAdmin: {type: Boolean, default: false},
   isInstructor: {type: Boolean, default: false},
   password: String,
   firstname: String,
   lastname: String,
   created: {type: Date, default: Date.now}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);