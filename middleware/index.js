var Session = require("../models/session");

var middlewareOBJ = {};

middlewareOBJ.checkSessionOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Session.findById(req.params.id, function(err, foundSession) {
            if(err || !foundSession) {
                req.flash("error", err.massage);
                res.redirect("back");
            } else {
                if(foundSession.createdBy.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission");
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareOBJ.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in");
    res.redirect("/login");
}

module.exports = middlewareOBJ;