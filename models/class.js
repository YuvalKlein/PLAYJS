var mongoose = require("mongoose");
    
var ClassSchema = new mongoose.Schema({
    title: String,
    image: {type: String, unique: false},
    location: String,
    lat: String,
    lng: String,
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

module.exports = mongoose.model("Class", ClassSchema);