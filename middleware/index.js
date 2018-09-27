var Class = require("../models/class");

var middlewareOBJ = {};

middlewareOBJ.checkClassOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Class.findById(req.params.id, function(err, foundClass) {
            if(err) {
                res.redirect("back");
            } else {
                if(foundClass.createdBy.id.equals(req.user._id)) {
                    next();
                } else {
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
    req.flash("error", "Please Sign In First!");
    res.redirect("/login");
}

module.exports = middlewareOBJ;