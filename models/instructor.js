var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
    
var InstructorSchema = new mongoose.Schema({
   username: String,
   email: String,
   password: String,
   firstname: String,
   lastname: String
});

InstructorSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Instructor", InstructorSchema);