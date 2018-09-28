var express = require("express"),
    router  = express.Router({mergeParams: true}),
    passport = require("passport"),
    User = require("../models/user"),
    Instructor = require("../models/instructor"),
    Class = require("../models/class"),
    middleware = require("../middleware");

router.get("/", function(req, res){
    res.redirect("/index")
})

// INDEX ROUTE
router.get("/index", function(req, res){
    Class.find({}, function(err, classes){
        if(err){
            console.log(err);
        } else {
            res.render("index", {classes: classes, currentUser: req.user});
        }
    });
});

// NEW CLASS
router.get("/index/new", middleware.isLogedin, function(req, res) {
    var instructors = Instructor.find({});
    res.render("newclass", {instructors: instructors});
});

// CREATE CLASS
router.post("/index", middleware.isLogedin, function(req, res){
    var newClass = {
        title: req.body.title,
        image: req.body.image, 
        location: req.body.location, 
        time: req.body.time,
        players: [{id: req.user._id, firstname: req.user.firstname, lastname: req.user.lastname}],
        createdBy: {id: req.user._id, firstname: req.user.firstname, lastname: req.user.lastname}
    };
    Class.create(newClass, function(err, newclass){
        if(err){
            console.log(err);
        } else {
            res.render("/index/:id");
        }
    });
});
                
//             console.log("varim: " + title + image + location + time + players + createdBy);
//             console.log("newClass" + newClass);
//             console.log("newclass" + newclass);
//             console.log(err);
//             res.render("newclass");
//         } else {
//             res.redirect("/index");
//         }
//     });
// });

// SHOW CLASS
router.get("/index/:id", function(req, res) {
    Class.findById(req.params.id).populate("users").exec(function(err, foundClass){
        if(err){
            console.log(err);
        } else {
            res.render("show", {classs: foundClass});
        }
    });
});

// MY CLASSES
router.get("/myClasses", middleware.isLogedin, function(req, res) {
    console.log("hjgj",req.log);
    //find currentUser ID and look just for classes that he signed in
    Class.find({_id: req.user._id}, function(err, myclasses){
        if(err){
            console.log(err);
        } else {
            res.render("index", {myclasses: myclasses, currentUser: req.user});
        }
    });
    res.render("myClasses");
});

// SIGN TO A CLASS
router.post("index/:id", middleware.isLogedin, function(req, res){
    Class.findByIdAndUpdate(req.params.id, req.body.classs, function(err, signToClass) {
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            console.log(signToClass);
            res.redirect("/index");
        }
    });
});


// EDIT CLASS
router.get("/index/:id/edit", middleware.checkClassOwnership, function(req, res) {
    Class.findById(req.params.id, function(err, foundClass) {
        if(err){
            res.redirect("/index");
        } else {
            res.render("edit", {classs: foundClass});
        }
    });
});

// UPDATE CLASS
router.put("/index/:id", middleware.checkClassOwnership, function(req, res) {
    Class.findByIdAndUpdate(req.params.id, req.body.class, function(err, updatedClass){
        if(err){
            console.log(err);
            res.redirect("/index");
        } else {
            console.log(updatedClass)
            res.redirect("/index/" + req.params.id);
        }
    });
});
    
// DELETE CLASS
router.delete("index/:id", middleware.checkClassOwnership, function(req, res){
    Class.findByIdAndRemove(req.params.id, function(err) {
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
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            console.log("xxhxfhjjgxgxhfxfj")
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
    res.redirect("/index");
});


module.exports = router;