var express = require("express"),
    router  = express.Router({mergeParams: true}),
    passport = require("passport"),
    User = require("../models/user"),
    Instructor = require("../models/instructor"),
    Session = require("../models/session"),
    middleware = require("../middleware"),
    NodeGeocoder = require('node-geocoder'),
    async = require("async"),
    nodemailer = require("nodemailer"),
    crypto = require("crypto"),
    multer = require('multer'),
    storage = multer.diskStorage({
        filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
    }),
    imageFilter = function (req, file, cb) {
        // accept image files only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    };
var upload = multer({ storage: storage, fileFilter: imageFilter});

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'yuklein', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});
 
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
        req.body.session.lat = data[0].latitude;
        req.body.session.lng = data[0].longitude;
        req.body.session.location = data[0].formattedAddress;
        req.body.session.players = [{id: req.user._id, firstname: req.user.firstname, lastname: req.user.lastname}],
        req.body.session.createdBy = {id: req.user._id, firstname: req.user.firstname, lastname: req.user.lastname},
        
    console.log("session= " + req.body.session);

        Session.create(req.body.session, function(err, createdSession){
            if(err){
                console.log(err);
                console.log("session= " + req.body.session);
            } else {
                console.log("session= " + req.body.session);
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
router.put("/session/:id", middleware.isLoggedIn, function(req, res){
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

// DELETE USER FROM CLASS
router.delete("/session/players/:id", middleware.isLoggedIn, function(req, res){
    if(err){
        console.log(err);
        res.redirect("back");
    } else {
        console.log(err);
        alert("canceled successfull!")
        res.redirect("back");
    }
})


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
        req.body.session.lat = data[0].latitude;
        req.body.session.lng = data[0].longitude;
        req.body.session.location = data[0].formattedAddress;
    
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

// FORGOT PASSWORD
router.get("/forgot", function(req, res) {
    res.render("forgot");
});

router.post("/forgot", function(req, res, next){
    async.waterfall([
        function(done){
            crypto.randomBytes(20, function(err, buf){
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({email: req.body.email}, function(err, user){
                if(!user){
                    req.flash('error', 'No account with that email address exists');
                    return res.redirect('/forgot');
                }
                
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; //one hour
                
                user.save(function(err){
                    done(err, token, user);
                });
            });
        },
        function(token, user, done){
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'yuval@yk-group.org',
                    pass: process.env.GMAILPW
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'yuval@yk-group.org',
                subject: 'Play Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                  'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                  'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                  'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err){
                console.log('mail sent');
                req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], function(err) {
        if(err) return next(err);
        res.redirect('/forgot');
    });
});

router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now()}}, function(err, user){
        if(!user){
            req.flash('error', 'Password reset token is invalid or has expired');
            return res.redirect('/forgot');
        }
        res.render('reset', {token: req.params.token});
    });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'yuval@yk-group.org',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'yuval@yk-group.org',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/index');
  });
});


//USER PROFILE
router.get("/users/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", "Something went wrong.");
            res.redirect("/");
        }
        Session.find().where("players.player.id").equals(foundUser._id).exec(function(err, sessions){
            if(err){
                req.flash("error", "Something went wrong!");
                res.redirect("/");
            }
            res.render("profile", {user: foundUser, sessions: sessions});
        })
    })
    
})


module.exports = router;