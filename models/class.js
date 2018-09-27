var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
    
var ClassSchema = new mongoose.Schema({
    title: String,
    image: {type: String, unique: false},
    location: String,
    instructor: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Instructor"
        },
        firstname: String,
        lastname: String
    },
    created: {type: Date, default: Date.now},
    createdBy: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        firstname: String,
        lastname: String
    },
    time: Date,
    players: [
        {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Instructor"
        },
        firstname: String,
        lastname: String
    }
    ]
});

ClassSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Class", ClassSchema);