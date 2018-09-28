var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    Instructor = require("./models/instructor"),
    Class = require("./models/class"),
    seedDB = require("./seeds");

var indexRoutes = require("./routes/index");


// APP CONFIG
mongodb://localhost/play_app
//mongoose.connect(process.env.DATABASEURL);
mongoose.connect("mongodb://yuklein:y11111@ds115523.mlab.com:15523/play");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIGURATION
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


app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use("/", indexRoutes);

app.listen(process.env.PORT, process.env.IP, function () {
    console.log("we are in! listing on port", process.env.PORT);
});