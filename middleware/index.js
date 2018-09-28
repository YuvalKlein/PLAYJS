var Class = require("../models/class");

var middlewareOBJ = {};

middlewareOBJ.checkClassOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Class.findById(req.params.id, function(err, foundClass) {
            if(err || !foundClass) {
                req.flash("error", err.massage);
                res.redirect("back");
            } else {
                if(foundClass.createdBy.id.equals(req.user._id)) {
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

middlewareOBJ.isLogedin = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in");
    res.redirect("/login");
}

module.exports = middlewareOBJ;