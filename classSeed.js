//var faker           = require('faker'),
 var   mongoose        = require("mongoose"),
    User            = require("./models/user"),
    Instructor      = require("./models/instructor"),
    Class           = require("./models/class");    
    
var sportName = ["TRX", "Soccer", "Yoga", "Pilatis", "Krav Maga", "Hip Hop"];
var classAmount = 15;
var instructorsList = [
    { "_id" : "5ba7b55a1d5a7914953f05d3", "email" : "Lorenzo90@gmail.com", "password" : "1111", "firstname" : "Reymundo", "lastname" : "O'Reilly", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05d7", "email" : "Timmothy56@yahoo.com", "password" : "1111", "firstname" : "Roscoe", "lastname" : "Fadel", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05d9", "email" : "Erin.Abshire19@hotmail.com", "password" : "1111", "firstname" : "Carter", "lastname" : "Ryan", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05db", "email" : "Francesco_Corkery70@yahoo.com", "password" : "1111", "firstname" : "Aubree", "lastname" : "Towne", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05dd", "email" : "Macie9@gmail.com", "password" : "1111", "firstname" : "Roberta", "lastname" : "Braun", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05df", "email" : "Araceli55@hotmail.com", "password" : "1111", "firstname" : "Lempi", "lastname" : "Steuber", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05e1", "email" : "Juanita90@yahoo.com", "password" : "1111", "firstname" : "Wellington", "lastname" : "Cronin", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05e5", "email" : "General.Barrows74@hotmail.com", "password" : "1111", "firstname" : "Ludwig", "lastname" : "Runte", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05e3", "email" : "Maymie8@hotmail.com", "password" : "1111", "firstname" : "Lenore", "lastname" : "Auer", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05e7", "email" : "Jennyfer.Klocko@yahoo.com", "password" : "1111", "firstname" : "Fern", "lastname" : "Beier", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05e9", "email" : "Conor11@hotmail.com", "password" : "1111", "firstname" : "Fiona", "lastname" : "Medhurst", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05eb", "email" : "Darien66@hotmail.com", "password" : "1111", "firstname" : "Nya", "lastname" : "Gutmann", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05ef", "email" : "Nyasia37@yahoo.com", "password" : "1111", "firstname" : "Elvis", "lastname" : "Raynor", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05ed", "email" : "Ellen_Marvin@gmail.com", "password" : "1111", "firstname" : "Curtis", "lastname" : "Ward", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05f1", "email" : "Margie78@hotmail.com", "password" : "1111", "firstname" : "Kelli", "lastname" : "Turner", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05f3", "email" : "Emmy10@gmail.com", "password" : "1111", "firstname" : "Noemi", "lastname" : "Pfeffer", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05f5", "email" : "Webster_Kuhlman96@gmail.com", "password" : "1111", "firstname" : "Cleo", "lastname" : "Brakus", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05f7", "email" : "Lane.Hayes@hotmail.com", "password" : "1111", "firstname" : "Rahul", "lastname" : "Satterfield", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05f9", "email" : "Cortez.Jones86@hotmail.com", "password" : "1111", "firstname" : "Christiana", "lastname" : "Lesch", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05fb", "email" : "Ebony_Cummings@hotmail.com", "password" : "1111", "firstname" : "Sister", "lastname" : "Borer", "__v" : 0 }
];

var usersList = [
    { "_id" : "5ba7b55a1d5a7914953f05d0", "email" : "Katlynn_Mueller32@yahoo.com", "password" : "1111", "firstname" : "Jacinthe", "lastname" : "Glover", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05d2", "email" : "Kasandra35@gmail.com", "password" : "1111", "firstname" : "Dave", "lastname" : "Kilback", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05d4", "email" : "Helga_Kessler@hotmail.com", "password" : "1111", "firstname" : "Jarred", "lastname" : "Nicolas", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05da", "email" : "Kolby_Rolfson36@yahoo.com", "password" : "1111", "firstname" : "Hortense", "lastname" : "Wisoky", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05d8", "email" : "Eriberto15@hotmail.com", "password" : "1111", "firstname" : "Genevieve", "lastname" : "Bins", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05de", "email" : "Ignatius0@yahoo.com", "password" : "1111", "firstname" : "Lilliana", "lastname" : "Adams", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05dc", "email" : "Perry84@gmail.com", "password" : "1111", "firstname" : "Julian", "lastname" : "Hilpert", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05e4", "email" : "Deangelo.Hills19@yahoo.com", "password" : "1111", "firstname" : "Jarod", "lastname" : "Brown", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05e2", "email" : "Ophelia3@gmail.com", "password" : "1111", "firstname" : "Jazmyn", "lastname" : "Herman", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05e6", "email" : "Wilton.Sauer72@gmail.com", "password" : "1111", "firstname" : "Sallie", "lastname" : "King", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05e8", "email" : "Jennings6@yahoo.com", "password" : "1111", "firstname" : "Arturo", "lastname" : "Heathcote", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05d6", "email" : "Angela.Ullrich@yahoo.com", "password" : "1111", "firstname" : "Lelah", "lastname" : "Schuster", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05ec", "email" : "Beau99@yahoo.com", "password" : "1111", "firstname" : "Samantha", "lastname" : "Frami", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05ee", "email" : "Patrick14@gmail.com", "password" : "1111", "firstname" : "Judd", "lastname" : "Kuvalis", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05f2", "email" : "Oda.Cole@yahoo.com", "password" : "1111", "firstname" : "Zachariah", "lastname" : "Oberbrunner", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05f0", "email" : "Estel.OKeefe13@yahoo.com", "password" : "1111", "firstname" : "Sven", "lastname" : "Sporer", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05e0", "email" : "Bernie63@gmail.com", "password" : "1111", "firstname" : "Yesenia", "lastname" : "Bode", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05f6", "email" : "Ali94@hotmail.com", "password" : "1111", "firstname" : "Lucius", "lastname" : "Blanda", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05ea", "email" : "Arvilla_Dach40@hotmail.com", "password" : "1111", "firstname" : "Earline", "lastname" : "Windler", "__v" : 0 },
    { "_id" : "5ba7b55a1d5a7914953f05fc", "email" : "Kelvin_Macejkovic20@hotmail.com", "password" : "1111", "firstname" : "Concepcion", "lastname" : "Streich", "__v" : 0 }
]



// var instructors = [];
// instructorsList.forEach(function(instructor){
//     var newInstructor = {id: instructor._id, firstname: instructor.firstname, lastname: instructor.lastname};
//     instructors.push(newInstructor);
// });
// console.log("instructors" + instructors);

// var users = [];
// usersList.forEach(function(user){
//     var newUser = {id: user._id, firstname: user.firstname, lastname: user.lastname};
//     users.push(newUser);
// });
// console.log("users" + users);

mongoose.connect("mongodb://localhost/play_app");
Class.remove({}, function(err){
    if(err){
        console.log(err);
    } 
    console.log("removed classes");
});

instructorsList.forEach(function(instructor) {
  Instructor.create(instructor);  
});

usersList.forEach(function(user) {
    User.create(user);
});

// User.find({}).exec(function(err, users) {
//     Instructor.find({}).exec(function(err, instructors){
// for(var i = 0; i < classAmount; i++){
//     Class.create(
//         {
//             title: randomSportName(sportName),
//             image: faker.image.sports(),
//             location: faker.address.streetName(),
//             instructor: randomObject(instructors),
//             time: faker.date.future(),
//             players: randomPlayersInClass(users),
//         }, function(err, event){
//                 if(err){
//                     console.log(err);
//                 } else {
//                     console.log("Newly created event");
//                     console.log(event);
//                 }
//         }
// )};
//     // })
// // })





// function randomObject(users){
//     var count = users.length;
//       // Get a random entry
//     var random = Math.floor(Math.random() * count)
//     var user = users[random];
//     return {name:user.firstname + " " + user.lastname, _id: user._id};
// }

// function randomSportName(arr){
//     for(var i = 0; i < classAmount; i++){
//         var random = Math.floor(Math.random() * arr.length);
//         var sport = arr[random];
//     }
//     return sport;
// }

// function randomPlayersInClass(users){
//     var playersInClass = Math.floor(Math.random() * 6 + 2);
//     var playerNames = [];
//     for(var i = 0; i < playersInClass; i++){
//         var userName = randomObject(users);
//         playerNames.push(userName);
//     }
//     return playerNames;
// }
