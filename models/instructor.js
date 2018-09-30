var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
    
var InstructorSchema = new mongoose.Schema({
   email: String,
   password: String,
   firstname: String,
   lastname: String,
   created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Instructor", InstructorSchema);