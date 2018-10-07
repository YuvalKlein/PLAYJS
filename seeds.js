//var faker           = require('faker'),
var    mongoose        = require("mongoose"),
    User            = require("./models/user"),
    Instructor      = require("./models/instructor"),
    Class           = require("./models/session");    
    
var sportName = ["TRX", "Soccer", "Yoga", "Pilatis", "Krav Maga", "Hip Hop"];
var classAmount = 15;

function seedDB() {
    User.remove({}, function(err){
        if(err){
            console.log(err);
        } 
        console.log("removed users");
    });
    Instructor.remove({}, function(err){
        if(err){
            console.log(err);
        } 
        console.log("removed Instructors");
    });
    // Class.remove({}, function(err){
    //     if(err){
    //         console.log(err);
    //     } 
    //     console.log("removed classes");
    // });
    for(var i = 0; i < 30; i++){
        User.create(
            {
                email: faker.internet.email(),
                password: "1111",
                firstname: faker.name.firstName(),
                lastname: faker.name.lastName()
            }, function(err, user){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("Newly created users");
                        console.log(user);
                    }
            }
        );   
        Instructor.create(
            {
                email: faker.internet.email(),
                password: "1111",
                firstname: faker.name.firstName(),
                lastname: faker.name.lastName()
            }, function(err, instructor){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("Newly created instructors");
                        console.log(instructor);
                    }
            }
        );
    };
        
    for(var i = 0; i < classAmount; i++){
        Class.create(
            {
                title: randomSportName(sportName),
                image: faker.image.sports(),
                location: faker.address.streetName(),
                instructor: randomObject(Instructor),
                time: faker.date.future(),
                players: randomPlayersInClass(),
            }, function(err, event){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("Newly created event");
                        console.log(event);
                    }
            }
    )};
}

function randomObject(collection){
    collection.count().exec(function (err, count) {
        
      // Get a random entry
      var random = Math.floor(Math.random() * count)
    
      // Again query all users but only fetch one offset by our random #
      collection.findOne().skip(random).exec(
        function (err, result) {
          // Tada! random user
          var first = result.firstname;
          var last = result.lastname;
          var name = first + " " +last;
          return name;
        });
});
}

function randomSportName(arr){
    for(var i = 0; i < classAmount; i++){
        var random = Math.floor(Math.random() * arr.length);
        var sport = arr[random];
    }
    return sport;
}

function randomPlayersInClass(){
    var playersInClass = Math.floor(Math.random() * 6 + 2);
    var playerNames = [];
    for(var i = 0; i < playersInClass; i++){
        var userName = randomObject(User);
        console.log('user name',userName)
        playerNames.push(userName);
    }
    return playerNames;
};

module.exports = seedDB;