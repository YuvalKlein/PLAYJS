var express = require("express"),
    router  = express.Router({mergeParams: true}),
    passport = require("passport"),
    User = require("../models/user"),
    Instructor = require("../models/instructor"),
    Session = require("../models/session"),
    middleware = require("../middleware"),
    NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

router.get("/", function(req, res){
    res.redirect("/index")
})

// INDEX ROUTE
router.get("/index", function(req, res){
    Session.find({}, function(err, sessions){
        if(err){
            console.log(err);
        } else {
            res.render("index", {sessions: sessions, currentUser: req.user});
        }
    });
});

// NEW SESSION
router.get("/index/new", middleware.isLoggedIn, function(req, res) {
    Instructor.find({}).exec(function(err, instructors){
        if(err){
            console.log(err);
        } else {
            res.render("newsession", {instructors: instructors});
        }
    });
});

// CREATE SESSION
router.post("/index", middleware.isLoggedIn, function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            console.log("data " + data);
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        } 
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
    var newSession = {
        title: req.body.title,
        image: req.body.image, 
        location: location,
        lat: lat,
        lng: lng, 
        time: req.body.time,
        players: [{id: req.user._id, firstname: req.user.firstname, lastname: req.user.lastname}],
        createdBy: {id: req.user._id, firstname: req.user.firstname, lastname: req.user.lastname},
        instructor: {id: req.body.instructor._id, firstname: req.body.instructor.firstname, lastname: req.body.instructor.lastname}
    };
    console.log("newSession.instructor" + newSession.instructor);
    console.log("req.body.instructor" + req.body.instructor);

        Session.create(newSession, function(err, createdSession){
            if(err){
                console.log(err);
            } else {
                res.redirect(`/index/${createdSession._id.toString()}`);
            }
        });
    });   
});   

// SHOW SESSION
router.get("/index/:id", function(req, res) {
    Session.findById(req.params.id).populate("users").exec(function(err, foundSession){
        if(err || !foundSession){
            req.flash("error", "Session not found");
            res.redirect("back");
        } else {
            res.render("show", {session: foundSession});
        }
    });
});

// MY SESSIONS
router.get("/mySessions", middleware.isLoggedIn, function(req, res) {
    console.log("hjgj",req.log);
    //find currentUser ID and look just for sessiones that he signed in
    Session.find({_id: req.user._id}, function(err, mysessions){
        if(err){
            console.log(err);
        } else {
            console.log(err);
            res.render("index", {mysessions: mysessions, currentUser: req.user});
        }
    });
    res.render("mySessions");
});

// SIGN TO A SESSION
router.put("session/:id", middleware.isLoggedIn, function(req, res){
    Session.findByIdAndUpdate(req.params.id, req.body.sessions, function(err, signToSession) {
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            console.log(signToSession);
            res.redirect("/index");
        }
    });
});


// EDIT SESSION
router.get("/index/:id/edit", middleware.checkSessionOwnership, function(req, res) {
    Session.findById(req.params.id, function(err, foundSession) {
        if(err){
            res.redirect("/index");
        } else {
            res.render("edit", {sessions: foundSession});
        }
    });
});

// UPDATE SESSION
router.put("/index/:id", middleware.checkSessionOwnership, function(req, res) {
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
        req.body.campground.lat = data[0].latitude;
        req.body.campground.lng = data[0].longitude;
        req.body.campground.location = data[0].formattedAddress;
    
        Session.findByIdAndUpdate(req.params.id, req.body.session, function(err, updatedSession){
            if(err){
                req.flash("error", err.message);
                console.log(err);
                res.redirect("back");
            } else {
                console.log(updatedSession);
                req.flash("success","Successfully Updated!");
                res.redirect("/index/" + req.params.id);
            }
        });
    });
});
    
// DELETE SESSION
router.delete("index/:id", middleware.checkSessionOwnership, function(req, res){
    Session.findByIdAndRemove(req.params.id, function(err) {
        if(err){
            console.log(err);
            res.redirect("/index");
        } else {
            res.redirect("/index");
        }
    });
});


// REGISTER
router.get("/register", function(req, res){
    res.render("register");
});

// CREATE NEW USER
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome" + user.firstname);
            res.redirect("/index");
            
        });
    });
});

// LOGIN
router.get("/login", function(req, res) {
    res.render("login", {message: req.flash("error")});
});

// LOGIN ROUTES
router.post("/login", passport.authenticate("local", 
    {
       successRedirect: "/index",
       failureRedirect: "/login"
    }), function(req, res){
        
});

// LOGOUT
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Successfully loged out!");
    res.redirect("/index");
});


module.exports = router;