var faker           = require('faker'),
    mongoose        = require("mongoose"),
    User            = require("./models/user"),
    Instructor      = require("./models/instructor"),
    Class           = require("./models/class"),
    passport        = require("passport"),
    express         = require("express"),
    LocalStrategy   = require("passport-local"),
    app             = express();
    
app.use(require("express-session")({
    secret: "day week month",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// passport.use(new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'password'
//   },
//   function(username, password, done) {
//     // ...
//   }
// ));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

for(var i = 0; i < 15; i++) {    
    var name = faker.name.firstName();
    var newUser = new User({username: name, firstname: name, lastname: faker.name.lastName(), email: faker.internet.email()});
        User.register(newUser, "1111", function(err, user){
            if(err){
                console.log(err);
            }
            console.log("new user====" + newUser);
            passport.authenticate("local")
        });
        console.log(name);
        console.log(newUser);
};
